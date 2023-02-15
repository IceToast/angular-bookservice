import { Keyword } from './../../shared/base-data';
import { KeywordService } from 'src/app/shared/base-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-keywords',
    templateUrl: './keywords.component.html',
    styleUrls: ['./keywords.component.scss'],
})
export class KeywordsComponent implements OnInit {
    currentKeyword?: Keyword;
    keywords: Keyword[] = [];

    constructor(public keywordService: KeywordService) {}

    ngOnInit(): void {
        this.reloadList();
    }

    onAddKeyword(): void {
        this.currentKeyword = new Keyword();
    }

    onIsKeywordUnique(keyword: Keyword) {
        // does keyword.keyword already exist in this.keywords?
        return this.keywords.some((k) => k.keyword === keyword.keyword);
    }

    onEditKeyword(keyword: Keyword) {
        this.currentKeyword = keyword;
    }

    onDeleteKeyword(keyword: Keyword) {
        if (keyword) {
            this.keywordService.deleteKeyword(keyword);
        }
    }

    onSaveKeyword() {
        if (this.currentKeyword) {
            this.keywordService.saveKeyword(this.currentKeyword);
        }
        this.reloadList();
    }

    onCancelKeyword() {
        this.currentKeyword = undefined;
    }

    private reloadList() {
        this.currentKeyword = undefined;
        this.keywordService.keywords$.subscribe(
            (value) => (this.keywords = value)
        );
    }
}
