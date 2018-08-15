import { Injectable } from '@angular/core';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { Router } from '../../../node_modules/@angular/router';

import Swal from 'sweetalert2'

import * as firebase from 'firebase';

import { map } from 'rxjs/operators'
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore) { }

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {

    });
  }

  crearUsuario( nombre: string, email: string, password: string ) {
    this.afAuth.auth
      .createUserWithEmailAndPassword( email, password )
      .then( resp => {
        
        const user: User = {
          uid: resp.user.uid,
          email: resp.user.email,
          nombre: nombre
        };

        this.afDB.doc( `${user.uid}/usuario` )
            .set( user )
            .then( () => {
              this.router.navigateByUrl('/');
            } );

        this.router.navigateByUrl( '/' );
      })
      .catch(error => {
        Swal('Error en el login', error.message, 'error');
      });
  }

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        console.log(resp);
        this.router.navigateByUrl('/');
      })
      .catch(error => {
        Swal('Error en el login', error.message, 'error');
      });
  }

  logOut() {
    this.router.navigateByUrl('/login');
    this.afAuth.auth.signOut();
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

}
