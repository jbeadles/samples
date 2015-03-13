"use strict";

var Contact = (function() {
    var contactSubmit = function() {
        var message;
        $("#js-MainContactSubmit").on("click", function(evt) {
            evt.preventDefault();

            var data = {
                contactName: $("input[name='contactName']").val(),
                contactEmail: $("input[name='contactEmail']").val(),
                contactDetails: $("textarea[name='contactDetails']").val()
            };

            $.ajax({
                type: "POST",
                url: "/contact",
                data: data
            }).done(function() {
                message = "<h3>Thanks for reaching out!</h3>" +
                "<p>I'll get back to you shortly.</p>";
                $("#js-ContactForm").remove();
                $(".contact-messages").append(message);
            }).fail(function() {
                message = "<h3>Oops! Something went wrong...</h3>" +
                "<p>Please try again or <a href='mailto:maraya@marayachasneyphotography.com'>email me directly.</a></p>";
                $(".contact-messages").append(message);
            });
        });
    };

    var footerSubmit = function() {
        var message;
        $("#js-FooterContactSubmit").on("click", function(evt) {
            evt.preventDefault();

            var data = {
                contactName: $("input[name='contactName']").val(),
                contactEmail: $("input[name='contactEmail']").val(),
                contactDetails: $("textarea[name='contactDetails']").val()
            };

            $.ajax({
                type: "POST",
                url: "/contact",
                data: data
            }).done(function() {
                message = "<h3>Thanks for reaching out!</h3>" +
                "<p>I'll get back to you shortly.</p>";
                $("#js-FooterContactForm").remove();
                $(".footer-contact-messages").append(message);
            }).fail(function() {
                message = "<h3>Oops! Something went wrong...</h3>" +
                "<p>Please try again or <a href='mailto:maraya@marayachasneyphotography.com'>email me directly.</a></p>";
                $(".footer-contact-messages").append(message);
            });
        });
    };

    var validateMainContactForm = function() {
        $("#js-ContactForm input[type='text'], #js-ContactForm textarea").on("keyup", function() {
            var contactName = $("#js-ContactForm input[name='contactName']").val(),
                contactEmail = $("#js-ContactForm input[name='contactEmail']").val(),
                contactDetails = $("#js-ContactForm textarea[name='contactDetails']").val();
            if (contactName.length > 0 && contactEmail.length > 0 && contactDetails.length > 0) {
                $("#js-MainContactSubmit").removeAttr("disabled");
            } else {
                if ($("#js-MainContactSubmit").attr("disabled")) {
                    return false;
                } else {
                    $("#js-MainContactSubmit").attr("disabled", true);
                }
            }
        });
    };

    var validateFooterContactForm = function() {
        $("#js-FooterContactForm input[type='text'], #js-FooterContactForm textarea").on("keyup", function() {
            var contactName = $("#js-FooterContactForm input[name='contactName']").val(),
                contactEmail = $("#js-FooterContactForm input[name='contactEmail']").val(),
                contactDetails = $("#js-FooterContactForm textarea[name='contactDetails']").val();
            if (contactName.length > 0 && contactEmail.length > 0 && contactDetails.length > 0) {
                $("#js-FooterContactSubmit").removeAttr("disabled");
            } else {
                if ($("#js-FooterContactSubmit").attr("disabled")) {
                    return false;
                } else {
                    $("#js-FooterContactSubmit").attr("disabled", true);
                }
            }
        });
    };

    return {
        contactSubmit: contactSubmit,
        footerSubmit: footerSubmit,
        validateMainContactForm: validateMainContactForm,
        validateFooterContactForm: validateFooterContactForm
    }
})();