import { Component } from '@angular/core';
import { ModalCandidatura } from '../../components/modal-candidatura/modal-candidatura';

@Component({
  selector: 'app-not-found-404',
  imports: [ModalCandidatura],
  standalone: true,
  templateUrl: './not-found-404.html',
  styleUrl: './not-found-404.css',
})
export class NotFound404 {}
