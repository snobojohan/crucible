"use strict";

var m        = require("mithril"),
    paginate = require("paginationator"),
    
    db = require("../lib/firebase"),

    nav = require("./nav");

module.exports = {
    controller : function() {
        var ctrl = this;
        

        ctrl.schema = {
            key : m.route.param("schema"),
            name : ""
        };

        ctrl.page = 0;

        ctrl.content = null;
        
        // need to go get schema name
        db.child("schemas/" + ctrl.schema.key).once("value", function(snap) {
            ctrl.schema.name = snap.val().name;
        });

        db.child("content/" + ctrl.schema.key).on("value", function(snap) {
            var entries = [];

            snap.forEach(function(record) {
                var data = record.val();

                data.key = record.key();

                entries.push(data);
            });

            ctrl.content = paginate(entries);

            m.redraw();
        });

        ctrl.add = function() {
            var result;
                
            result = db.child("content/" + ctrl.schema.key).push({
                _name    : "New " + name,
                _created : db.TIMESTAMP
            });

            m.route("/content/" + schema + "/" + result.key());
        };

        ctrl.change = function(page, e) {
            e.preventDefault();

            ctrl.page = page;
        };
    },

    view : function(ctrl) {
        var page = ctrl.content ? ctrl.content.pages[ctrl.page] : { items : [] };

        return [
            m.component(nav),
            m("h1", "CONTENT"),
            m("div",
                m("h2", ctrl.schema.name),
                m("p",
                    m("button", { onclick : ctrl.add }, "Add " + ctrl.schema.name)
                ),
                m("table",
                    m("tr",
                        m("th", "Name"),
                        m("th", "Created"),
                        m("th", "Updated"),
                        m("th", m.trust("&nbsp;"))
                    ),
                    page.items.map(function(data) {
                        return m("tr", { key : data.key },
                            m("td",
                                m("a", { href : "/content/" + ctrl.schema.key + "/" + data.key, config : m.route }, data._name)
                            ),
                            m("td", data._created),
                            m("td", data._updated),
                            m("td",
                                m("button", "Delete")
                            )
                        );
                    })
                ),
                ctrl.content ?
                    m("div",
                        page.prev ?
                            m("a", {
                                href : "#/page" + page.prev - 1,
                                onclick : ctrl.change.bind(null, page.prev - 1)
                            }, m.trust("&lt; "), page.prev) :
                            m.trust("&lt; &nbsp;"),
                        ctrl.content.pages.map(function(page) {
                            return m("a", {
                                href : "#/page" + page.idx,
                                onclick : ctrl.change.bind(null, page.idx)
                            }, page.current);
                        }),
                        page.next ?
                            m("a", {
                                href : "#/page" + page.next - 1,
                                onclick : ctrl.change.bind(null, page.next - 1)
                            }, page.next, m.trust("&gt;")) :
                            m.trust("&nbsp; &gt;")
                    ) :
                    null
            )
        ];
    }
};
