import Component from "@glimmer/component";
import { withSilencedDeprecations } from "discourse/lib/deprecated";
import { withPluginApi } from "discourse/lib/plugin-api";
import RenderGlimmer from "discourse/widgets/render-glimmer";
import { hbs } from "ember-cli-htmlbars";
import FirstReplyStatement from "../components/first-reply-statement";

function firstReplyPost(api) {
  api.renderAfterWrapperOutlet(
    "post-article",
    class extends Component {
      static shouldRender(args) {
        const topic = args.post?.topic;
        
        // Private message check
        if (topic?.archetype === "private_message") {
          return false;
        }
        
        // Only appear after the first post
        if (args.post?.post_number !== 1) {
          return false;
        }
        
        // Disabled categories check
        if (settings.disabled_categories) {
          const categoriesId = settings.disabled_categories
            .split("|")
            .map((id) => parseInt(id, 10));
          if (categoriesId.includes(topic?.category_id)) {
            return false;
          }
        }
        
        // Only show if this is the only post and can be replied to
        if (topic?.posts_count !== 1) {
          return false;
        }
        
        if (!topic?.details?.can_create_post) {
          return false;
        }
        
        return true;
      }
      
      <template>
        <div class="first-reply-statement-wrapper">
          <FirstReplyStatement 
            @model={{@args.post.topic}} 
            @belowOP={{true}} 
          />
        </div>
      </template>
    }
  );
  
  // wrap the old widget code silencing the deprecation warnings
  withSilencedDeprecations("discourse.post-stream-widget-overrides", () =>
    firstReplyPostOld(api)
  );
}

function firstReplyPostOld(api) {
  api.decorateWidget("post:after", function (helper) {
    const model = helper.getModel();
    const topic = model.topic;
    
    // Private message check
    if (topic.archetype === "private_message") {
      return;
    }
    
    // Only appear after the first post
    if (model.post_number !== 1) {
      return;
    }
    
    // Disabled categories check
    if (settings.disabled_categories) {
      const categoriesId = settings.disabled_categories
        .split("|")
        .map((id) => parseInt(id, 10));
      if (categoriesId.includes(topic.category_id)) {
        return;
      }
    }
    
    // Only show if this is the only post and can be replied to
    if (topic.posts_count !== 1) {
      return;
    }
    
    if (!topic.details?.can_create_post) {
      return;
    }
    
    return [
      new RenderGlimmer(
        helper.widget,
        "div.first-reply-statement-wrapper",
        hbs`<FirstReplyStatement @outletArgs={{@data}}/>`,
        {
          model: topic,
          belowOP: true,
        }
      ),
    ];
  });
}

export default {
  name: "first-reply-statement",
  initialize() {
    withPluginApi((api) => {
      firstReplyPost(api);
    });
  }
};
