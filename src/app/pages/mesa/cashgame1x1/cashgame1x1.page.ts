import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PlayerIdService } from 'src/app/services/player-id.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-cashgame1x1',
  templateUrl: './cashgame1x1.page.html',
  styleUrls: ['./cashgame1x1.page.scss'],
})
export class Cashgame1x1Page implements OnInit {
  tableType: string = 'cashgame';
  tableData: object = null;

  isModalOpen: boolean = false;

  joinedRoomTop: boolean = false;
  joinedRoomBottom: boolean = false;
  joinedRoomLeft: boolean = false;
  joinedRoomRight: boolean = false;
  j1: boolean = false;
  j2: boolean = false;
  j3: boolean = false;
  j4: boolean = false;
  cardsRivalTop: Array<any>;
  cardsRivalLeft: Array<any>;
  cardsRivalRight: Array<any>;

  namej1: string = '';
  namej2: string = '';
  namej3: string = '';
  namej4: string = '';

  avatar1: string = '';
  avatar2: string = '';
  avatar3: string = '';
  avatar4: string = '';

  maxPlayer: number = 0;

  nome = '';
  position = '';

  players = [];
  countPlayer = 0;
  joined: boolean = false;

  cards = [{ naipe: 'copas', numero: 7 }]; // teste

  leftAnimation: boolean = false;
  topAnimation: boolean = false;
  rightAnimation: boolean = false;
  bottomAnimation: boolean = true;

  bottomCardNumber = 0;
  bottomCardNaipe = 0;

  topCardNumber = 0;
  topCardNaipe = 0;
  leftCardNumber = 0;
  leftCardNaipe = 0;

  rightCardNumber = 0;
  rightCardNaipe = 0;

  // Minhas adições Tiago:
  // -> espectadores
  spectorsCount: string | number = '----';
  // -> cartas de exemplo
  exampleCards: object[];
  // -> carta vira (A que fica por baixo da carta de costa em baixo do jackpot!!)
  cardVira = {};
  count: number = 0;
  pontosNos: number = 0;
  pontosEles: number = 0;
  rodadas: number = 0;
  friend: string = '';

  constructor(
    private WebSocket: WebSocketService,
    private modalController: ModalController,
    private playerIdService: PlayerIdService,
    private activatedRoute: Router
  ) {
    this.tableData =
      this.activatedRoute.getCurrentNavigation().extras.state.data;
  }

  ngOnInit() {
    this.generatePlayers();
    this.nome =
      this.players[Math.floor(Math.random() * this.players.length)].username;
    this.playerIdService.setNome(this.nome);

    let id = this.playerIdService.getId();

    this.WebSocket.emit('insertPlayerx1', {
      id: id,
      username: this.nome,
      posicao: 'right',
      room: '1',
      src: '/assets/game/game/homem.png',
    });

    this.WebSocket.listen('findPlayersx1').subscribe((data: any) => {
      this.cardVira = data.vira[0];
      this.playerIdService.setManilha(data.manilha);
      this.playerIdService.setVira(this.cardVira);

      data.jogadores.forEach((player: any) => {
        console.log(player);

        if (player.username == this.nome) {
          player.posicao = 'bottom';
          this.j1 = true;
          this.avatar1 = player.src;
          this.namej1 = player.username;
          this.exampleCards = player.mao;
          console.log(player.mao);
        } else {
          this.j3 = true;
          player.posicao = 'top';
          this.avatar3 = player.src;
          this.namej3 = player.username;
          this.cardsRivalTop = [1, 2, 3];
        }
      });
    });
  }
  generatePlayers() {
    let posicoes = ['top', 'bottom', 'left', 'right'];
    for (let i = 0; i < 100; i++) {
      let indexPosicoes = Math.floor(Math.random() * posicoes.length);
      this.players.push({
        username: 'joao ' + i,
        src: '/assets/game/game/homem.png',
        posicao: posicoes[indexPosicoes],
        room: '1',
        friend: '',
        rival1: '',
        rival2: '',
        mao: '',
        id: this.playerIdService.getId(),
      });
    }
  }
}
