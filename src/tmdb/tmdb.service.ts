import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TmdbService {
  private readonly apiToken: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.apiToken = this.configService.get('TMDB_ACCESS_TOKEN');
    this.baseUrl = this.configService.get('TMDB_API_URL');
  }

  async getPopularMovies(page: number = 1) {
    return await this.makeRequest(`${this.baseUrl}/movie/popular?page=${page}`);
  }

  async getMovieGenres() {
    return await this.makeRequest(`${this.baseUrl}/genre/movie/list`);
  }

  private async makeRequest(url: string) {
    return await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        Accept: 'application/json',
      },
    });
  }
}
