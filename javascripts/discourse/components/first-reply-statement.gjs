import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { htmlSafe } from "@ember/template";
import { eq } from "truth-helpers";
import replaceEmoji from "discourse/helpers/replace-emoji";
import dIcon from "discourse-common/helpers/d-icon";
import I18n from "discourse-i18n";

export default class FirstReplyStatement extends Component {
  @tracked belowOP = this.args.outletArgs.belowOP ? true : false;

  get topicDetails() {
    return this.args.outletArgs.model.get("details");
  }

  get shouldShow() {
    if (this.args.outletArgs.model.archetype === "private_message") {
      return;
    }

    if (
      this.belowOP &&
      this.args.outletArgs.model.posts_count === 1 &&
      this.topicDetails.can_create_post
    ) {
      return true;
    }
  }

  get title() {
    return I18n.t(themePrefix("first_replier.title"));
  }

  get description() {
    return I18n.t(themePrefix("first_replier.description"));
  }

  <template>
    {{#if this.shouldShow}}
      <div class="first-reply-statement">
        <div class="first-replier --image">
          {{#if (eq settings.image_type "icon")}}
            {{dIcon settings.icon}}
          {{else if (eq settings.image_type "image")}}
            <img src="{{settings.image}}"/>
          {{/if}}
        </div>
        <div class="first-replier --description">
          <span>{{replaceEmoji (htmlSafe this.title)}}</span>
          <span>{{replaceEmoji (htmlSafe this.description)}}</span>
        </div>
      </div>
    {{/if}}
  </template>
}
