"use strict";
var Gallery = require('../models/Gallery'),
    Album = require('../models/Album'),
    PricingPackage = require('../models/PricingPackage'),
    PricingItem = require('../models/PricingItem'),
    async = require('async');

module.exports = function(app,transporter) {
    app.get('/', function(req,res) {
        Gallery.find({featured: true}, function(err, galleries) {
            if (!err) {
                res.render('index', { featuredGalleries: galleries });
            } else {
                console.log(err);
            }
        });
    });

    /* =======================
    /* Galleries
    /* ==================== */

    app.get('/galleries', function(req, res) {
        Gallery.find(function(err, galleries) {
            if (!err) {
                res.render('galleries/index', { galleries: galleries });
            } else {
                throw new Error("There was an issue loading galleries.  Please try again later.");
            }
        });
    });

    app.get('/galleries/:gallery_slug', function(req, res) {
        var gallerySlug = req.params.gallery_slug,
            galleryId;
        Gallery.find({slug: gallerySlug}, function(err, gallery) {
            if (!err) {
                galleryId = gallery[0]._id;
                Album.find({gallery_id: galleryId}, function(err, albums) {
                    if (!err) {
                        res.render('galleries/show', {
                            gallery: gallery[0],
                            albums: albums
                        });
                    } else {
                        throw new Error("There are no albums associated with this gallery.  Please choose another gallery.");
                    }
                });
            } else {
                throw new Error("Could not find the specified gallery.  Please try again later.");
            }
        });
    });

    //TODO: Album slugs might not be unique - include gallery ID in query first
    app.get('/galleries/:gallery_slug/:album_slug', function(req, res) {
            var albumSlug = req.params.album_slug,
                albumImages;
        Album.find({slug: albumSlug}, function(err, album) {
            if (!err) {
                albumImages = album[0].images;
                res.render('albums/show', {
                    album: album[0],
                    images: albumImages
                });
            } else {
                throw new Error("There are no images associated with this album.")
            }
        });
    });

    /* =======================
     /* Pricing Packages
     /* ==================== */
    app.get('/pricing', function(req, res) {
        async.parallel({
            pricingPackages: function(callback) {
                PricingPackage.find(function(err, pricingPackages) {
                    if (!err) {
                         callback(null, pricingPackages);
                    }
                });
            },
            pricingItems: function(callback) {
                PricingItem.find(function(err, pricingItems) {
                    if (!err) {
                        callback(null, pricingItems);
                    }
                });
            }
        },
        function(err, results) {
            res.render('pricing/index', {
                pricingPackages: results.pricingPackages,
                pricingItems: results.pricingItems
            });
        });
    });

    /* =======================
     /* Contact
     /* ==================== */
    app.get('/contact', function(req, res) {
        res.render('contact/index');
    });

    // footer contact form
    app.post('/contact', function(req, res) {
        var contact = req.body,
            contactName = contact.contactName,
            contactEmail = contact.contactEmail,
            contactDetails = contact.contactDetails,
            mailOptions = {
                from: 'jbeadles@beardbrainatx.com',
                to: 'jbeadles@beardbrainatx.com',
                subject: 'New Contact Received: ' + contactEmail,
                text: 'New Contact Received',
                html: '<p>New Contact Received</p>' +
                        '<p>Contact Name: ' + contactName + '</p>' +
                        '<p>Contact Email: ' + contactEmail + '</p>' +
                        '<p>Contact Details: ' + contactDetails + '</p>'
            };

        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Message sent:' + info.response);
            }
        });
        res.end();
    });

};
