import { Injectable } from '@angular/core';

import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { Store } from '@ngrx/store';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { AppState } from '../app.reducer';

import { Router } from '../../../node_modules/@angular/router';

import Swal from 'sweetalert2'

import * as firebase from 'firebase';

import { map } from 'rxjs/operators'
import { User } from './user.model';
import { SetUserAction, UnsetUserAction } from './auth.actions';
import { Subscription } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private userSubscription: Subscription = new Subscription();
  private usuario: User;

  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState>) { }

  initAuthListener() {
    
    this.userSubscription = this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      if (fbUser) {
        this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
          .subscribe( (usuarioObj: any) => {
            const newUser = new User(usuarioObj);
            this.store.dispatch( new SetUserAction(newUser));
            this.usuario = newUser;
          });
      } else {
        this.usuario = null;
        this.userSubscription.unsubscribe();
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {

    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(resp => {

        const user: User = {
          uid: resp.user.uid,
          email: resp.user.email,
          nombre: nombre
        };

        this.afDB.doc(`${user.uid}/usuario`)
          .set(user)
          .then(() => {
            this.router.navigateByUrl('/');
            this.store.dispatch(new DesactivarLoadingAction());
          });
      })
      .catch(error => {
        Swal('Error en el login', error.message, 'error');
        this.store.dispatch(new DesactivarLoadingAction());
      });
  }

  login(email: string, password: string) {

    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigateByUrl('/');
        this.store.dispatch(new DesactivarLoadingAction());
      })
      .catch(error => {
        Swal('Error en el login', error.message, 'error');
        this.store.dispatch(new DesactivarLoadingAction());
      });
  }

  logOut() {
    this.router.navigateByUrl('/login');
    this.afAuth.auth.signOut();

    this.store.dispatch( new UnsetUserAction() );
  }

  isAuth() {
    return this.afAuth.authState
      .pipe(
        map(fbUser => {
          if (fbUser == null) {
            this.router.navigateByUrl('/login');
          }
          return fbUser != null
        })
      );
  }

  getUsuario() {
    return { ...this.usuario };
  }

}
