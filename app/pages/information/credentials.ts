import {Page, NavController, NavParams, Modal, ViewController, Platform} from 'ionic-framework/ionic';
import {Quiz} from '../../quiz/controller'
import {Details} from '../quiz/details'
import {IGame, IGameEntry} from "../../quiz/interfaces";

@Page({
    templateUrl: 'build/pages/information/credentials.html'
})
export class CredentialsPage {
    private nav: NavController;
    private games: IGame[];

    private showCategory:boolean = true;
    private selectedCategory:number = 0;
    private selectedGameId: string = null;

    private data:IGameEntry[];
    private searchQuery:string = '';


    constructor(nav:NavController, navParams: NavParams) {
        this.nav = nav;
        this.games = Quiz.getGames();
        if (typeof navParams.get("showCategory") != "undefined") {
            this.showCategory = navParams.get("showCategory");
            this.selectedGameId = navParams.get("selectedGameId");
            this.selectedCategory = navParams.get("selectedCategory");
        }

        this.initializeItems()

    }

    initializeItems() {
        if (this.selectedCategory >= 0 && this.selectedCategory < this.games.length) {
            this.data = this.games[this.selectedCategory].GamesSet;
        }
    }

    openLink(url:string, otherwise:string) {
        if (url && url.startsWith("http")) {
            window.open(url, "_system");
        } else if (otherwise && otherwise.startsWith("http")) {
            window.open(otherwise, "_system");
        }
        return true;
    }

    getItems(searchbar):void {
        // Reset items back to all of the items
        this.initializeItems();

        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }

        this.data = this.data.filter((v) => {
            if (v.Name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        })
    }

    onClickCategory(no: number) {
        this.selectedCategory = no;
        this.selectedGameId = this.games[this.selectedCategory].id;
        this.nav.push(CredentialsPage, {
                "showCategory": false,
                "selectedGameId": this.selectedGameId,
                "selectedCategory": this.selectedCategory
            },
            {"animate": true},
            null);
    }

    showDetails(entry: IGameEntry) {
        let modal = Modal.create(Details, {"gameId": this.selectedGameId ,"item": entry});
        this.nav.present(modal);
    }
}
