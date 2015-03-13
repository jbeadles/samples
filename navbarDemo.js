Navbar = {
    init: function() {
        this.hover();
    },
    hover: function() {
        var activeLink = $('.navlink.active');
        var navlinks = $(".navbar .navlink");
        navlinks.each(function() {
            $(this).on('mouseenter',function() {
                var $this = $(this);
                if(!$this.hasClass('active')) {
                    activeLink.removeClass('active');
                    $this.addClass('active');
                }
            });
            $(this).on('mouseleave',function() {
                var $this = $(this);
                $this.removeClass('active');
                activeLink.addClass('active');
            });
        });
    }
};