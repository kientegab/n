import { TestBed } from '@angular/core/testing';

import { ArticleProjetService } from './article-projet.service';

describe('ArticleProjetService', () => {
  let service: ArticleProjetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleProjetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
