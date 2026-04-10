import { Component } from '@angular/core';
import { ModalLogin } from '../../components/modal-login/modal-login';
import { ModalRegistro } from '../../components/modal-registro/modal-registro';
import { ModalCandidatura } from '../../components/modal-candidatura/modal-candidatura';

@Component({
  selector: 'app-inicio',
  imports: [ModalLogin, ModalRegistro, ModalCandidatura],
  standalone: true,
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {}
