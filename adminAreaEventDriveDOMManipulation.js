"use strict";

var Scout = (function() {

    var bind = {
        addPackageItem: function() {
            var el = $("#js-packageItems"),
                packageItemsInput = "<div class='package-item-input-container'>"
                    + "<input type='text', name='packageItems'><a href='#' class='remove-package-item'>Remove</a>"
                    + "</div>";
            $(".ADMIN_ROUTE-form").on("click", "#js-addPackageItems", function(evt) {
                evt.preventDefault();
                el.append(packageItemsInput);
            });
        },
        deletePackageItem: function() {
            $(".ADMIN_ROUTE-form").on("click", ".remove-package-item", function(evt) {
                evt.preventDefault();
                $(this).closest(".package-item-input-container").remove();
            });
        },
        deletePricingPackage: function() {
            $(".delete-pricing-package").on("click", function(evt) {
                evt.preventDefault();
                var container = $(this).closest(".pricing-package"),
                    packageId = $(this).data("package-id"),
                    url = "/ADMIN_ROUTE/packages/" + packageId;
                $.ajax({
                    url: url,
                    type: "DELETE",
                    data: {
                        packageId: packageId
                    }
                }).success(function() {
                    container.remove();
                }).error(function(err) {
                    console.log(err);
                });
            });

            $(".delete-pricing-item").on("click", function(evt) {
                evt.preventDefault();
                var container = $(this).closest(".pricing-package"),
                    itemId = $(this).data("pricing-item-id"),
                    url = "/ADMIN_ROUTE/packages/items/" + itemId;
                $.ajax({
                    url: url,
                    type: "DELETE",
                    data: {
                        pricingItemId: itemId
                    }
                }).success(function() {
                    container.remove();
                }).error(function(err) {
                    console.log(err);
                });
            });
        },
        deleteItem: function(itemType) {
            $('.item-display__delete-link').each(function() {
                $(this).on('click', function(evt) {
                    evt.preventDefault();

                    var confirmation = confirm("Are you sure you want to delete this " + itemType + "?"),
                        $this = $(this),
                        galleryId = $this.data('gallery'),
                        url;
                    if(confirmation) {
                        if(itemType == "image") {
                            var imageToDelete = $this.data('image'),
                                albumId = $this.data('album'),
                                isAlbumCover = $this.parents('.item-container').find('.cover-image-radio').data('is-cover'),
                                imageContainer = $this.closest('.item-display');
                            url = "/ADMIN_ROUTE/galleries/" + galleryId + "/albums/" + albumId + "/images";
                            Scout.deleteImageFromAlbum(url, imageToDelete, imageContainer, isAlbumCover);
                        } else if(itemType == "album") {
                            var albumToDelete = $this.data('album'),
                                isGalleryCover = $this.parents('.item-container').find('.cover-image-radio').data('is-cover'),
                                albumContainer = $this.closest('.item-display');
                            url = "/ADMIN_ROUTE/galleries/" + galleryId + "/albums";
                            Scout.deleteAlbumFromGallery(url, albumToDelete, albumContainer, isGalleryCover);
                        } else if (itemType == "gallery") {
                            var galleryContainer = $this.closest(".item-display");
                            url = "/ADMIN_ROUTE/galleries/" + galleryId;
                            Scout.deleteGallery(url, galleryId, galleryContainer);
                        }
                    }
                });
            });
        },
        coverPhotoRadio: function(coverFor) {
            $('.cover-image-radio').each(function() {
                // Set to checked if it is the cover photo
                var isCover = $(this).data('is-cover');
                if(isCover) {
                    $(this).attr('checked','checked');
                }

                var albumId,
                    coverImage,
                    galleryId,
                    url;

                $(this).on('change', function() {
                    var $this = $(this);
                    coverImage = $this.data('image');
                    galleryId = $this.data('gallery');
                    if(coverFor === "album") {
                        albumId = $this.data('album');
                        url = "/ADMIN_ROUTE/galleries/" + galleryId + "/albums/" + albumId + "/images/cover";
                    } else if(coverFor === "gallery") {
                        url = "/ADMIN_ROUTE/galleries/" + galleryId + "/cover-photo";
                    }
                    Scout.updateCoverPhoto(url,coverImage);
                });
            });
        },
        featuredGalleryCheckbox: function() {
            $(".featured-gallery-checkbox").each(function() {

                var isChecked = $(this).data("is-featured");
                if (isChecked) {
                    $(this).attr("checked", "checked");
                }

                $(this).on("change", function() {
                    var $this = $(this),
                        galleryId = $this.val(),
                        isFeatured = $this.is(":checked"),
                        url = "/ADMIN_ROUTE/galleries/" + galleryId;
                    Scout.updateFeaturedGallery(url, isFeatured);
                });
            });
        }
    };

    var manageFileUploadButtonState = function(fileInput,button) {
        $(fileInput).on("change", function() {
            $(button).removeAttr('disabled');
        });
    };

    var deleteAlbumFromGallery = function(url,albumToDelete,albumContainer,isCover) {
        $.ajax({
            url: url,
            type: "DELETE",
            data: {
                albumToDelete: albumToDelete,
                isCover: isCover
            }
        }).success(function() {
            $(albumContainer).remove();
        }).error(function(err) {
            console.log(err);
        });
    };

    var deleteGallery = function(url, galleryToDelete, galleryContainer) {
        $.ajax({
            url: url,
            type: "DELETE",
            data: {
                galleryToDelete: galleryToDelete
            }
        }).success(function() {
            $(galleryContainer).remove();
        }).error(function(err) {
            console.error(err);
        });

    };

    var deleteImageFromAlbum = function(url,imageToDelete,imageContainer,isCover) {
        $.ajax({
            url: url,
            type: "DELETE",
            data: {
                imageToDelete: imageToDelete,
                isCover: isCover
            }
        }).success(function() {
            $(imageContainer).remove();
        }).error(function(err) {
            console.log(err);
        });
    };

    var deleteUser = function() {
        $(".delete-user-link").on("click", function() {
            var userEmail = $(this).data("user"),
                elementToDelete = $(this).closest(".user");
            $.ajax({
                url: "/ADMIN_ROUTE/users",
                type: "DELETE",
                data: {
                    userEmail: userEmail
                }
            }).done(function() {
                elementToDelete.remove();
            }).fail(function(err) {
                console.log(err);
            });
        });
    };

    var updateCoverPhoto = function(url,coverPhoto) {
        $.ajax({
            url: url,
            type: 'PUT',
            data: {
                coverPhoto: coverPhoto
            }
        }).error(function(err) {
            console.log(err);
        });
    };

    var updateFeaturedGallery = function(url, isFeatured) {
        $.ajax({
            url: url,
            type: "PUT",
            data: {
                isFeatured: isFeatured
            }
        }).error(function(err) {
            console.log(err);
        });
    };

    return {
        bindEvents: bind,
        deleteAlbumFromGallery: deleteAlbumFromGallery,
        deleteGallery: deleteGallery,
        deleteImageFromAlbum: deleteImageFromAlbum,
        deleteUser: deleteUser,
        manageFileUploadButtonState: manageFileUploadButtonState,
        updateCoverPhoto: updateCoverPhoto,
        updateFeaturedGallery: updateFeaturedGallery
    }
})();