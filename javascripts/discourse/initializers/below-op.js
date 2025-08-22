import Component from "@glimmer/component";
import { withPluginApi } from "discourse/lib/plugin-api";
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
}

export default {
  name: "first-reply-statement",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      firstReplyPost(api);
    });
  }
};
