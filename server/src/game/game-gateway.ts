// Third
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Player {
  playerId: string;
  playerName: string;
  score: number;
}

@WebSocketGateway(3002, {
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private players: Player[] = [];
  private gameStarted = false;
  private currentRound = 0;
  private totalRounds = 5;
  private minPlayers = 2;

  private gameStartCountdown = 5; // seconds before game starts
  private roundDuration = 10; // seconds for each round
  private nextRoundDelay = 5; // seconds between rounds

  // Fires when a socket connects
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Fires when a socket disconnects
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    const leftPlayer = this.players.find((p) => p.playerId === client.id);

    if (leftPlayer) {
      // Remove player from list
      this.players = this.players.filter((p) => p.playerId !== client.id);

      this.server.emit('player_update', this.players);

      client.broadcast.emit('player_left', {
        playerId: leftPlayer.playerId,
        playerName: leftPlayer.playerName,
      });
    }
  }

  // Handle player joining the game
  @SubscribeMessage('join_game')
  handleJoinGame(
    @MessageBody() playerName: string,
    @ConnectedSocket() client: Socket,
  ) {
    const newPlayer: Player = {
      playerId: client.id,
      playerName: playerName,
      score: 0,
    };

    this.players.push(newPlayer);

    client.emit('joined_game', newPlayer);
    this.server.emit('player_update', this.players);
    client.broadcast.emit('player_joined', newPlayer);

    // Start game if enough players
    if (!this.gameStarted && this.players.length >= this.minPlayers) {
      this.beginGameWithCountdown();
    }
  }

  // Notify clients and begin countdown to game start
  private beginGameWithCountdown() {
    this.gameStarted = true;
    this.currentRound = 0;

    this.server.emit('game_start', {
      message: 'Game is starting!',
      duration: this.gameStartCountdown,
      countdownStart: Date.now(),
      totalRounds: this.totalRounds,
    });

    setTimeout(() => {
      this.runNextRound();
    }, this.gameStartCountdown * 1000);
  }

  // Start a new round or end game if all rounds completed
  private runNextRound() {
    this.currentRound++;

    if (this.currentRound > this.totalRounds) {
      return this.endGame();
    }

    // Notify new round + round countdown
    this.server.emit('new_round', {
      round: this.currentRound,
      totalRounds: this.totalRounds,
      duration: this.roundDuration,
      countdownStart: Date.now(),
    });

    // Wait for round duration before selecting winner
    setTimeout(() => {
      this.selectRoundWinner();
    }, this.roundDuration * 1000);
  }

  // Randomly select a round winner
  private selectRoundWinner() {
    if (this.players.length === 0) return;

    const winnerIndex = Math.floor(Math.random() * this.players.length);
    const winner = this.players[winnerIndex];

    winner.score += 1;

    this.server.emit('round_result', {
      round: this.currentRound,
      winnerId: winner.playerId,
      winnerName: winner.playerName,
      scores: this.players,
      duration: this.nextRoundDelay,
      countdownStart: Date.now(),
    });
    this.server.emit('player_update', this.players);

    setTimeout(() => {
      this.runNextRound();
    }, this.nextRoundDelay * 1000);
  }

  // End the game and send final results
  private endGame() {
    const maxScore = Math.max(...this.players.map((p) => p.score));
    const winners = this.players.filter((p) => p.score === maxScore);

    this.server.emit('game_over', {
      finalScores: this.players,
      winners: winners,
    });
  }

  @SubscribeMessage('restart_game')
  handleRestartGame(@ConnectedSocket() client: Socket) {
    console.log(`Game restarted by: ${client.id}`);
    this.resetGame();

    // Optionally notify clients that the game has been reset
    this.server.emit('game_reset');
  }

  // Allow player to leave the game
  @SubscribeMessage('leave_game')
  handleLeaveGame(@ConnectedSocket() client: Socket) {
    this.handleDisconnect(client);
    client.disconnect();

    if (this.players.length === 0) {
      this.gameStarted = false;
      this.resetGame();
    }
  }

  // Reset all game state
  private resetGame() {
    this.gameStarted = false;
    this.currentRound = 0;
    this.players = [];
  }
}
