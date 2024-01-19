class StateManager {

    selected = {level: null, object: null}; // {level, object}
    lastSelectedObj = {level: null, object: null};
    state = "VIEW"; //EDIT_RANGE,EDIT_TARGETS,VIEW

    //for all scenes and childScenes: updateState(selected);

    updateSelected(level, object) {
        this.selected.level = level;
        this.selected.object = object;
        this.lastSelectedObj.level = level;
        this.lastSelectedObj.object = object;
        game.activeScenes.forEach(actS => {
            actS.onUpdateSelected(this.selected);
        });

        if(level == 'summoner') {
            updateQueryParams("summoner="+object.id);
        } else if(level == 'summon') {
            updateQueryParams("summoner="+currentSummoner.get().id + "&summon="+object.id);
        } else {
            updateQueryParams("summoner="+currentSummoner.get().id + "&summon="+currentSummon.get().id + "&action="+object.id);
        }
    }

    updateState(state) {
        this.state = state;
        game.activeScenes.forEach(actS => {
            actS.onUpdateState(this.state);
        });
    }


}