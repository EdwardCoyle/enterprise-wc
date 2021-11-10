import IdsEventsMixin from "../../mixins/ids-events-mixin/ids-events-mixin";
import IdsThemeMixin from "../../mixins/ids-theme-mixin/ids-theme-mixin";
import IdsListView from '../ids-list-view/ids-list-view';

const Base = IdsEventsMixin(
  IdsThemeMixin(
    IdsListView
  )
)

export default Base;
