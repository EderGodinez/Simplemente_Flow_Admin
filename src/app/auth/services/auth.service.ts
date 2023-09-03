import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { enviroments } from 'src/environments/environments';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces/index';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(){
    this.checkAuthStatus().subscribe()
   }

  private readonly baseUrl:string=enviroments.baseUrl
  private http=inject(HttpClient);

  private _current=signal<User|null>(null)
  private _authStatus=signal<AuthStatus>(AuthStatus.checking)

  public currentUser=computed(()=>this._current())
  public authStatus=computed(()=>this._authStatus())

  private setAutentication(User:User,token:string):boolean{
    this._current.set(User);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('Token',token);
    return true;
  }

  login( email: string, password: string ): Observable<boolean> {

    const url  = `${ this.baseUrl }/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>( url, body )
      .pipe(
        map( ({ User, token }) => this.setAutentication( User, token )),
        catchError( err => throwError( () => err.error.message ))
      );
  }
  

  checkAuthStatus():Observable<boolean> {

    const url   = `${ this.baseUrl }/auth/check-token`;
    const token = localStorage.getItem('Token');

    if ( !token ) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);


      return this.http.get<CheckTokenResponse>(url, { headers })
        .pipe(
          map( ({ User, token }) => this.setAutentication( User, token )),
          catchError(() => {
            this._authStatus.set( AuthStatus.notAuthenticated );
            return of(false);
          })
        );


  }

  logout() {
    localStorage.removeItem('Token');
    this._current.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );

  }

}
