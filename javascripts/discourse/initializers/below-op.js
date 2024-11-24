import { hbs } from "ember-cli-htmlbars";
import { apiInitializer } from "discourse/lib/api";
import RenderGlimmer from "discourse/widgets/render-glimmer";

export default apiInitializer("1.20.0", (api) => {
  api.decorateWidget("post:after", function (helper) {
    const model = helper.getModel();
    const disabledCategories = settings.disabled_categories.split("|").map((id) => parseInt(id, 10)).filter((id) => id);
    if (
      model.topic.archetype === "private_message" ||
      disabledCategories
    ) {
      return;
    }

    if (model.post_number === 1) {
      return [
        new RenderGlimmer(
          helper.widget,
          "div.first-reply-statement-wrapper",
          hbs`<FirstReplyStatement @outletArgs={{@data}}/>`,
          {
            model: model.topic,
            belowOP: true,
          }
        ),
      ];
    }
  });
});
