import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ViewportScroller} from "@angular/common";

import {map, Observable} from "rxjs";
import {pluck} from "rxjs/operators";
import {RepliesService} from "../replies.service";
import {HNItem} from "../../shared/hn.modal";

@Component({
    selector: 'app-replies-page',
    templateUrl: './replies-page.component.html',
    styleUrls: ['./replies-page.component.css']
})
export class RepliesPageComponent implements OnInit {

    constructor(
        private sanitizer: DomSanitizer,
        private scroller: ViewportScroller,
        private repliesService: RepliesService
    ) {
    }

    ngOnInit() {
        this.scroller.scrollToPosition([0, 0]);
    }

    get story() {
        return this.repliesService.storyItem$;
    }

    get replies() {
        return this.repliesService.storyItem$.pipe(
            pluck('replies')
        );
    }

    get trustedUrl(): Observable<SafeUrl> {
        return this.repliesService.storyItem$.pipe(
            pluck('url'),
            map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url)),
        );
    }

    handleLazyLoad(item: HNItem) {
        this.repliesService.loadLazyReplies(item).subscribe(
            () => console.debug('load done')
        )
    }

}
