import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { filter } from 'rxjs/operators';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  nombre: string;
  subscription: Subscription = new Subscription();

  constructor(public authService: AuthService, 
              private store: Store<AppState>,
              public ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
      .pipe(
        filter(auth => auth.user != null)
      )
      .subscribe(auth => this.nombre = auth.user.nombre);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onLogOut() {
    this.authService.logOut();
    this.ingresoEgresoService.cancelarSubscriptions();
  }

}
