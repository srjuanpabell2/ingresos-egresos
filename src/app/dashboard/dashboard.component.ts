import { Component, OnInit } from '@angular/core';
import { IngresoEgresoService } from '../ingreso-egreso/ingreso-egreso.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  constructor(public ingresoEgresoService: IngresoEgresoService,
              public authService: AuthService) { }

  ngOnInit() {
    this.authService.initAuthListener();
    this.ingresoEgresoService.initIngresoEgresoListener();
  }

}
