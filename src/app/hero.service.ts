import { Injectable } from '@angular/core';

import { Hero } from "./hero";
import { HEROES } from "./mock-heroes";
import { MessageService } from "./message.service";

import { Observable, of } from "rxjs";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

    private heroesUrl = 'api/heroes';

    httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  /**
   * getHeroes
   */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')), 
        catchError(this.handleError<Hero[]>('getHeroes', []))
      )
    }

    /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  
  private log(message: string) {
    this.messageService.add(`HeroSerive: ${message}`);
  }
  /**
   * getHero
   */
  public getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }
  
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  /**
   * updateHero
   */
  public updateHero(hero: Hero) {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}