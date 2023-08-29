var smilies = Object.keys(smilies_list)
  , smiliesreplacment = Object.values(smilies_list);
function convertTimestamp(e) {
    var t = e.getHours()
      , o = e.getMinutes()
      , s = t >= 12 ? "PM" : "AM";
    return (t = (t %= 12) || 12) + ":" + (o = o < 10 ? "0" + o : o) + " " + s
}
function format_before_send(e) {
    return content = e.replace(/(https?:\/\/|www\.)[^\s"<>{}`]+/g, e=>{
        let t = e
          , o = /:[\w?]+:|<3|:-P|:-\)|:-D|;-\)/g;
        return t.match(o) && (e = e.replace(t.match(o)[0], " " + t.match(o)[0])),
        e
    }
    )
}
function format_smilies(e) {
    return e.replace(/:[\w?]+:|<3|:-P|:-\)|:-D|;-\)/g, e=>{
        var t = smilies
          , o = smiliesreplacment
          , s = t.indexOf(e);
        return -1 !== s ? '<img loading="lazy" src="https://static.cracked.io/images/smilies/{url}" data-shortname="{shortname}" alt="{alt}" class="smilie" title="{title}" />'.replace("{url}", o[s]).replace("{shortname}", t[s]).replace("{alt}", t[s]).replace("{title}", t[s]) : e
    }
    )
}
$("body").on("click", "[data-shortname]", function() {
    var e = $(this).attr("data-shortname");
    if ($("#message_input").is(":visible"))
        var t = "#message_input";
    else
        t = "#message_edit";
    return "true" === Cookies.get("mobile") ? $(t).val($(t).val() + " " + e + " ") : $(t).val($(t).val() + " " + e + " ").focus(),
    !1
});
var Shoutbox = window.Shoutbox || {};
function DiscordCheck(e) {
    if (!new RegExp("^[a-zA-Z0-9#:-_ ]+$").test(e))
        return !1
}
function fetchData() {}
void 0 === window.jQuery && (jQuery = $ = {}),
function(e, t, o) {
    "use strict";
    const s = 16
      , n = 17
      , a = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      , i = {
        template: '<tr class="banning-entry" data-id="{id}"><td align="center">{username}</td><td align="center">{reason}</td><td align="center">{unbanDate}</td>{unbanButton}<td align="center">{mod}</td></tr>',
        unbanButton: '<td align="center"><input type="button" class="button unban-button" value="Unban" /></td>'
    };
    e.extend(Shoutbox, {
        server: null,
        socket: null,
        userRoom: "main",
        mentionSound: null,
        mode: "none",
        cooldown: {
            value: 0,
            interval: null,
            placeholder: ""
        },
        connect: function() {
            var e = this.server;
            this.socket = io.connect(e, {
                transports: ["websocket"],
                query: "token=" + this.userToken
            }),
            setInterval(()=>{
                console.log(this.socket)
            }
            , 2e3)
        },
        emit: function(e, t) {
            this.socket.emit(e, t)
        },
        handleEvents: function() {
            this.socket.on(2, t=>{
                void 0 !== t.message.mode && (this.mode = t.message.mode),
                e("#container-" + t.room).prepend(this.buildTemplate(t.message))
            }
            ),
            this.socket.on(3, t=>{
                var o = e('[data-id="' + t + '"]');
                o.length > 0 && o.fadeOut("slow", function() {
                    e(this).remove()
                })
            }
            ),
            this.socket.on(4, t=>{
                var o = e('[data-id="' + t.id + '"]');
                o.length > 0 && o.find(".text").html(format_smilies(t.message))
            }
            ),
            this.socket.on(5, t=>{
                e(".entry.pinned").remove(),
                e("#shoutbox .body").prepend(this.buildTemplate(t, "pinned"))
            }
            ),
            this.socket.on(151, t=>{
                e("#shoutbox_ban_modal .ban-error").show(),
                t.success ? (e("#shoutbox_ban_modal .ban-error .tcat").text("User successfully banned !"),
                setTimeout(()=>{
                    e("#shoutbox_ban_modal .close-modal").trigger("click"),
                    e("#shoutbox_ban_modal .ban-error").hide()
                }
                , 1200)) : t.error && e("#shoutbox_ban_modal .ban-error .tcat").text(t.error)
            }
            ),
            this.socket.on(153, t=>{
                if (e("#shoutbox .modal").remove(),
                t.reason.length > 0)
                    var o = "You have been banned from the shoutbox for the following reason: " + t.reason + ".";
                else
                    o = "You have been banned from the shoutbox.";
                -1 == t.unban ? o += " You were permanently banned." : o += " Your banning will expire on " + new Date(t.unban).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }) + " at " + new Date(t.unban).toLocaleTimeString("en-US"),
                e("#shoutbox .panel").html('<div class="shoutbox-error">' + o + "</div>")
            }
            ),
            this.socket.on(2304, t=>{
                e("#banlist_users .banning-entry").remove(),
                t && (Shoutbox.permissions.mod || e("#shoutbox_banlist_modal .tcat.unban").remove(),
                e("#banlist_users").append(this.buildBanningTemplate(t))),
                e("#shoutbox_banlist_modal").modal({
                    keepelement: !0
                })
            }
            ),
            this.socket.on(152, t=>{
                e('[data-id="' + t._id + '"]').fadeOut(function() {
                    e(this).remove()
                })
            }
            ),
            this.socket.on(32, t=>{
                e("#leaderboard_users .leaderboard-entry").remove(),
                t && e("#leaderboard_users").append(this.buildLeaderboardTemplate(t)),
                e("#shoutbox_leaderboard_modal").modal({
                    keepelement: !0
                })
            }
            ),
            this.socket.on(s, t=>{
                this.mode = t.mode,
                this.initCooldown(t.cooldown),
                e("#shoutbox_settings_modal #sound").prop("checked", t.sound),
                e("#shoutbox_settings_modal #volume").val(100 * t.volume),
                e("#shoutbox_settings_modal #whisper").prop("checked", t.whisper),
                e("#shoutbox_settings_modal #custom_sound").val(t.url),
                this.mentionSound = new Audio(t.url ? t.url : "https://www.freesoundslibrary.com/wp-content/uploads/2018/01/ding-sound-effect.mp3"),
                this.mentionSound.onerror = (()=>{
                    this.mentionSound.src = "https://www.freesoundslibrary.com/wp-content/uploads/2018/01/ding-sound-effect.mp3"
                }
                ),
                this.mentionSound.volume = t.volume,
                this.mentionSound.muted = !t.sound
            }
            ),
            this.socket.on(n, t=>{
                e("#shoutbox_settings_modal .confirm-message").show(),
                t.success ? (e("#shoutbox_settings_modal .confirm-message .tcat").text("Your settings were successfully saved !"),
                setTimeout(()=>{
                    e("#shoutbox_settings_modal .close-modal").trigger("click"),
                    e("#shoutbox_settings_modal .confirm-message").hide()
                }
                , 1200),
                this.mentionSound.src = t.settings.url.length > 0 ? t.settings.url : "https://www.freesoundslibrary.com/wp-content/uploads/2018/01/ding-sound-effect.mp3",
                this.mentionSound.volume = t.settings.volume,
                this.mentionSound.muted = !t.settings.sound) : t.error && e("#shoutbox_settings_modal .confirm-message .tcat").text(t.error)
            }
            )
        },
        buildLeaderboardTemplate: function(e) {
            var t = "";
            for (var o of e)
                t += '<tr class="leaderboard-entry"><td align="center">{username}</td><td align="center">{number}</td></tr>'.replace("{username}", o.user).replace("{number}", o.total);
            return t
        },
        buildBanningTemplate: function(e) {
            var t = "";
            for (var o of e) {
                var s = new Date(o.unban)
                  , n = s.getDate()
                  , r = s.getMonth()
                  , d = s.getFullYear()
                  , l = String("0" + s.getHours()).slice(-2)
                  , u = String("0" + s.getMinutes()).slice(-2);
                t += i.template.replace("{id}", o._id).replace("{username}", o.user).replace("{reason}", o.reason).replace("{unbanDate}", n + " " + a[r] + " " + d + " - " + l + ":" + u).replace("{mod}", o.mod),
                t = Shoutbox.permissions.mod ? t.replace("{unbanButton}", i.unbanButton) : t.replace("{unbanButton}", "")
            }
            return t
        },
        prepareMessage: function(t, o="") {
            t.date = new Date(t.date);
            var s = t.username
              , n = e(s).text();
            "" != t.discord && !1 === DiscordCheck(t.discord) && (t.discord = "");
            var a = '<div class="entry {extraClasses}" data-id="{id}" data-time="{time}" data-sellix-type="{type}" data-sellix-value="{value}" data-sellix-embed="{embed}" data-user="{uid}" data-discord="{discord}" data-shouts="{shouts}"><div class="avatar"><img class="normal_avatar" loading="lazy" src="{avatarLink}" alt="avatar" /></div><div class="user" style="min-width: 110px;">{username}</div><div class="text">{message}</div><div class="info"><a href="" class="mod whisper">W</a>{editButton}{deleteButton}{pinButton}<span class="date">{date}</span></div></div>';
            a = Shoutbox.permissions.mod || Shoutbox.permissions.mod_own && t.uid == Shoutbox.userId ? a.replace("{editButton}", '<a href class="mod edit">E</a>').replace("{deleteButton}", '<a href class="mod del">X</a>').replace("{pinButton}", Shoutbox.permissions.mod ? '<a href class="mod pin">P</a>' : "") : a.replace("{editButton}", "").replace("{deleteButton}", "").replace("{pinButton}", ""),
            t.item && (t.username += '<img width="14" height="14" class="item-icon" src="' + t.item + '" />');
            var i = []
              , r = !0;
            if ("market" == t.room && (r = !1),
            t.private && "market" == t.room && i.push("hide_message"),
            -1 !== e.inArray(t.uid, ignored_uids) && (i.push("ignore_message"),
            r = !1),
            t.private && (t.username += " whispers"),
            t.private && current_username != n && i.push("private"),
            !0 === r && this.mentionRegex.test(t.content) && i.push("mention"),
            o && i.push(o),
            (d = t.content).includes("New thread"))
                var d = t.content;
            else
                d = format_smilies(d);
            if (1 == timeformat || 2 == timeformat)
                var l = convertTimestamp(t.date);
            else
                l = t.date.getHours() + ":" + String("0" + t.date.getMinutes()).slice(-2);
            return a.replace("{embed}", "0").replace("{type}", "").replace("{value}", "").replace("{extraClasses}", i.join(" ")).replace("{id}", t.id).replace("{time}", l).replace("{uid}", t.uid).replace("{discord}", t.discord).replace("{shouts}", t.shouts).replace("{avatarLink}", t.avatar).replace("{date}", l).replace("{username}", t.username).replace("{message}", d)
        },
        buildTemplate: function(e, t="") {
            if (Array.isArray(e)) {
                var o = "";
                for (let t of e)
                    o += this.prepareMessage(t);
                return o
            }
            return this.mentionRegex.test(e.content) && this.mentionSound.play(),
            this.prepareMessage(e, t)
        },
        processTagging: function(t) {
            if (e("#message_input").is(":visible"))
                var o = "#message_input";
            else
                o = "#message_edit";
            /\s/.test(t) ? e(o).val(e(o).val() + "@[" + t + "] ").focus() : e(o).val(e(o).val() + "@" + t + " ").focus()
        },
        processWhispering: function(t) {
            e("#message_input").is(":hidden") && e("#cancel_edit").trigger("click"),
            e("#message_input").val("/w @" + t + ": ").focus()
        },
        initCooldown: function(t) {
            this.cooldown.value = t,
            this.cooldown.value > 0 && (this.cooldown.placeholder = "Your next shout can be done in " + Math.trunc(this.cooldown.value / 6e4) + "-minutes",
            this.cooldown.value < 6e4 && (this.cooldown.placeholder = "Your next shout can be done in less than a minute",
            this.cooldown.interval = setTimeout(()=>{
                this.cooldown.interval = null,
                this.cooldown.placeholder = ""
            }
            , this.cooldown.value)),
            this.cooldown.interval = setInterval(()=>{
                this.cooldown.value < 6e4 ? (this.cooldown.placeholder = "Your next shout can be done in less than a minute",
                this.cooldown.interval = setTimeout(()=>{
                    this.cooldown.interval = null,
                    this.cooldown.placeholder = ""
                }
                , this.cooldown.value)) : (this.cooldown.value -= 6e4,
                this.cooldown.placeholder = "Your next shout can be done in " + Math.trunc(this.cooldown.value / 6e4) + "-minutes")
            }
            , 6e4),
            "market" == this.userRoom && e("#shoutbox #message_input").attr("placeholder", this.cooldown.placeholder).prop("disabled", !0))
        }
    }),
    e(".shoutbox-tabs .sh-tab").on("click", function(t) {
        if (!e(this).hasClass("at")) {
            e(".shoutbox-tabs .sh-tab").removeClass("at"),
            e(this).addClass("at");
            var o = e(this).data("container");
            e("#shoutbox .shoutbox-messages").hide(),
            e(o).fadeIn("fast"),
            Shoutbox.userRoom = e(this).data("room"),
            "market" == Shoutbox.userRoom && Shoutbox.cooldown.placeholder ? e("#shoutbox #message_input").attr("placeholder", Shoutbox.cooldown.placeholder).prop("disabled", !0) : e("#shoutbox #message_input").attr("placeholder", "Enter message...").prop("disabled", !1)
        }
    }),
    e(o).on("click", ".normal_avatar", function(t) {
        var o = e(this).closest(".entry").find(".user a").text();
        Shoutbox.processTagging(o)
    }),
    e(o).on("click", ".mod.whisper", function(t) {
        t.preventDefault();
        var o = e(this).parents(".entry").data("id")
          , s = e('[data-id="' + o + '"]').first();
        Shoutbox.processWhispering(s.find(".user a").text())
    }),
    e(o).on("click", ".mod.del", function(t) {
        t.preventDefault();
        var o = e(this).closest(".entry").data("id");
        Shoutbox.emit(3, o),
        e("#message_input").is(":hidden") && e("#cancel_edit").trigger("click")
    }),
    e(o).on("click", ".mod.pin", function(t) {
        t.preventDefault();
        var o = e(this).closest(".entry").data("id");
        Shoutbox.emit(5, o)
    }),
    e(o).on("click", ".entry:not(.edit) .mod.edit:not(.mod.del)", function(t) {
        t.preventDefault();
        var s = e(this).closest(".entry").data("id");
        if ("" === s)
            return !1;
        0 === e(".edit_form").length && (e("#message_input").before(e('<span class="edit_form"><input type="text" class="text" name="message_edit" value="" id="message_edit" maxlength="250" data-user="" data-id="" /><i class="fas fa-times-circle" id="cancel_edit"></i></span>')),
        e(".binding-menu .whisper").hide()),
        e(".entry").removeClass("edit"),
        e(".entry[data-id=" + s + "]").addClass("edit");
        var n = e(this).closest(".entry").find(".user").text();
        if (e(".entry[data-id=" + s + "]").is("[data-sellix-embed=1]")) {
            var a = '<div class="sellix_template">' + e(this).closest(".entry").find(".text").find(".sellix_template").html() + "</div>"
              , i = (e(".entry[data-id=" + s + "]").attr("data-sellix-type"),
            e(".entry[data-id=" + s + "]").attr("data-sellix-value"),
            e(".entry[data-id=" + s + "]").find(".text").html().replace(a, ""));
            e(".entry[data-id=" + s + "]").attr("data-sellix-embed", "0").attr("data-sellix-type", "").attr("data-sellix-value", "").find(".text").html(i)
        }
        var r, d, l = (r = e(this).closest(".entry").find(".text"),
        (d = e("<div>").html(e(r).html())).find("img").replaceWith(function() {
            var e = this.alt
              , t = this.src;
            return "" != e ? ("smilie" == e && (e = ":" + t.replace("https://cracked.io/images/smilies/", "").replace(/\.[^/.]+$/, "") + ":"),
            e) : ""
        }),
        d.html()), u = o.createElement("div");
        u.innerHTML = l,
        e("#message_input").hide(),
        e(".edit_form").show(),
        e(".edit_form input").attr("data-id", s).attr("data-user", n).val(u.innerText.trim()).focus()
    }),
    e("#message_input").on("keypress", function(t) {
        if (13 == t.keyCode || 13 == t.which) {
            var o = format_before_send(e(this).val().replace(/(?:\:)\b(\w*)\b(?=\:)/g, function(e) {
                return e.toLowerCase()
            }));
            if (o.trim().length > 0) {
                let t = Shoutbox.antiflood;
                "slow" == Shoutbox.mode && (t = 3),
                (0 == Shoutbox.lastMsgDate || Shoutbox.lastMsgDate + 1e3 * t < Date.now() || "twitch" == Shoutbox.mode) && (Shoutbox.emit(2, {
                    message: o,
                    room: Shoutbox.userRoom
                }),
                "true" === Cookies.get("mobile") ? (e(".emoji_menu").hide(),
                e("#message_input").val("")) : e("#message_input").val("").focus(),
                Shoutbox.lastMsgDate = Date.now(),
                "market" == Shoutbox.userRoom && (fetchData(),
                Shoutbox.initCooldown(18e5)))
            }
        }
    }),
    e("#shoutbox_banlist").on("click", function(e) {
        e.preventDefault(),
        Shoutbox.emit(2304)
    }),
    e("body").on("click", "#cancel_edit", function() {
        return e(".edit_form").remove(),
        e(".entry").removeClass("edit"),
        e("#message_input").show(),
        e(".binding-menu .whisper").show(),
        e("#container-market").is(":visible") && fetchData(),
        !1
    }),
    e("body").on("dblclick", ".entry", function(t) {
        e(this).is(".edit") ? e("#cancel_edit").trigger("click") : e(this).find(".mod.edit").trigger("click")
    }).children().on("dblclick", ".entry .avatar", function(e) {
        return !1
    }).children().on("dblclick", ".entry .smilie", function(e) {
        return !1
    }),
    e("body").on("keydown", "#message_edit", function(t) {
        var o = e(this).attr("data-id");
        "ArrowDown" === t.key && e(".entry[data-user=" + Shoutbox.userId + "][data-id=" + o + "]").prevAll(".entry[data-user=" + Shoutbox.userId + "]").length > 0 && (o = e(".entry[data-user=" + Shoutbox.userId + "][data-id=" + o + "]").prevAll(".entry[data-user=" + Shoutbox.userId + "]").attr("data-id"),
        e(".entry[data-id=" + o + "]").find(".edit").trigger("click")),
        "ArrowUp" === t.key && e(".entry[data-user=" + Shoutbox.userId + "][data-id=" + o + "]").nextAll(".entry[data-user=" + Shoutbox.userId + "]").length > 0 && (o = e(".entry[data-user=" + Shoutbox.userId + "][data-id=" + o + "]").nextAll(".entry[data-user=" + Shoutbox.userId + "]").attr("data-id"),
        e(".entry[data-id=" + o + "]").find(".edit").trigger("click"));
        var s = format_before_send(e("#message_edit").val().replace(/(?:\:)\b(\w*)\b(?=\:)/g, function(e) {
            return e.toLowerCase()
        }).trim());
        27 != t.keyCode && 27 != t.which || e("#cancel_edit").trigger("click"),
        13 != t.keyCode && 13 != t.which || o && s.length > 0 && (Shoutbox.emit(4, {
            id: o,
            message: s
        }),
        fetchData(),
        e("#cancel_edit").trigger("click"))
    }),
    e(o).on("click", "#shoutbox_ban_button", function() {
        var t = e("#shoutbox_ban_modal .username").val().trim()
          , o = e("#shoutbox_ban_modal .reason").val().trim()
          , s = e("#shoutbox_ban_modal .duration").val().trim()
          , n = e("#shoutbox_ban_modal .period").val();
        t.length > 0 && Shoutbox.emit(151, {
            username: t,
            reason: o,
            duration: s,
            period: n
        })
    }),
    e(o).on("click", ".unban-button", function() {
        var t = e(this).closest(".banning-entry").data("id");
        t && Shoutbox.emit(152, {
            banningId: t
        })
    }),
    e("#shoutbox_leaderboard").on("click", function(e) {
        e.preventDefault(),
        Shoutbox.emit(32, !0)
    }),
    e("#shoutbox_settings").on("click", function(t) {
        t.preventDefault(),
        e("#shoutbox_settings_modal").modal({
            keepelement: !0
        })
    }),
    e(o).on("click", "#shoutbox_settings_button", function(t) {
        t.preventDefault();
        var o = e("#shoutbox_settings_modal #sound").prop("checked")
          , s = e("#shoutbox_settings_modal #volume").val() / 100
          , a = e("#shoutbox_settings_modal #whisper").prop("checked")
          , i = e("#shoutbox_settings_modal #custom_sound").val();
        Shoutbox.emit(n, {
            sound: o,
            volume: s,
            url: i,
            whisper: a
        })
    }),
    e(o).on("contextmenu", "#shoutbox .entry .user a", function(t) {
        t.preventDefault();
        var o = e(t.currentTarget).closest(".entry");
        o.data("user") != Shoutbox.userId && Shoutbox.permissions.mod ? e(".binding-menu .ban").show() : e(".binding-menu .ban").hide(),
        o.data("discord").length > 0 ? (e(".binding-menu .discord").show(),
        e(".binding-menu .discord .value").text(o.data("discord"))) : e(".binding-menu .discord").hide(),
        e(".binding-menu .shouts .value").text(o.data("shouts")),
        e(".binding-menu").finish().toggle(100).offset({
            top: t.pageY,
            left: t.pageX
        }).data("id", o.data("id"))
    }),
    e(o).on("mousedown", function(t) {
        !e(t.target).parents(".binding-menu").length > 0 && e(".binding-menu").hide(100)
    }),
    e("document").ready(function() {
        e(".smilie_form").click(function() {
            return e(".emoji_menu").addClass("borderless").slideToggle(),
            !1
        })
    }),
    e("document").ready(function() {
        e("#send_message").click(function() {
            if (e("#message_input").is(":visible"))
                var t = e.Event("keypress")
                  , o = "#message_input";
            else
                o = "#message_edit",
                t = e.Event("keydown");
            t.which = 13,
            e(o).trigger(t)
        }),
        e("#shoutbox_settings_button").click(function() {
            e("#smilies_container").is(":checked") ? (e("a[title='Smilies']").attr("id", "smilie_form"),
            e(".emoji_menu").hide(),
            Cookie.set("shoutbox_smilies", "boxed")) : (e("a[title='Smilies']").attr("id", "sb_smilies"),
            e(".emoji_menu").hide(),
            Cookie.set("shoutbox_smilies", "default")),
            e("#ignore").is(":checked") ? Cookie.set("ignore", "yes") : Cookie.set("ignore", "no"),
            e("#ignore").is(":checked") ? (e("#shoutbox").addClass("hide_ignored"),
            Cookie.set("ignore", "yes")) : (e("#shoutbox").removeClass("hide_ignored"),
            Cookie.set("ignore", "default")),
            e("#ignore_mesvak").is(":checked") ? (e("#shoutbox").addClass("shoutbox_ignore_mesvak"),
            Cookie.set("ignore_mesvak", "yes")) : (e("#shoutbox").removeClass("shoutbox_ignore_mesvak"),
            Cookie.set("ignore_mesvak", "default")),
            e("#expand_shoutbox").is(":checked") ? (e("#shoutbox").addClass("shoutbox_expand"),
            Cookie.set("shoutbox_expand", "yes")) : (e("#shoutbox").removeClass("shoutbox_expand"),
            Cookie.set("shoutbox_expand", "default"))
        })
    }),
    e("body").on("click", ".action", function() {
        var t = e(this).closest(".binding-menu").data("id")
          , o = e('[data-id="' + t + '"]').first();
        e(this).hasClass("whisper") && Shoutbox.processWhispering(o.find(".user a").text()),
        e(this).hasClass("tag") && Shoutbox.processTagging(o.find(".user a").text()),
        e(this).hasClass("ban") && (e("#shoutbox_ban_modal .username").val(o.find(".user a").text()),
        e("#shoutbox_ban_modal").modal({
            keepelement: !0
        })),
        e(".binding-menu").hide(100)
    }),
    e(o).ready(function() {
        Shoutbox.connect(),
        Shoutbox.handleEvents(),
        Shoutbox.mentionRegex = new RegExp('<a href=".+(uid=' + Shoutbox.userId + ')"')
    })
}(window.jQuery, window, document),
$("body").on("click", ".ignore_message .text", function() {
    $(this).parents(".entry").removeClass("ignore_message")
}),
$("document").ready(function() {
    $("[data-room=market").click(function() {
        fetchData()
    }),
    $("#container-market").is(":visible") && setTimeout(fetchData, refresh_time)
});
