var m = require("mithril");

export function view() {
    return [
        m("h1", "Anthracite Setup"),
        
        m("ol",
            m("li", "Copy config-example.js to config.js"),
            m("li", "Edit config.js to add your firebase URL"),
            m("li", m("button", {
                onclick : function() {
                    window.location = "/";
                }
            }, "I've done that"))
        )
    ];
}
