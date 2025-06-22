<?php
/**
 * Plugin Name:       Zodiac Slot Machine
 * Description:       A plugin to display the Zodiac Slot Machine application using a shortcode.
 * Version:           1.0.0
 * Author:            Matt
 * Author URI:        https://yourwebsite.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       zodiac-slot-machine
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * The function that will be called when the shortcode is used.
 *
 * @return string The HTML content to be displayed.
 */
function zodiac_slot_machine_shortcode_handler() {
    // This div is where our React app will be mounted.
    // The actual app scripts will be enqueued separately.
    return '<div id="zodiac-app-root"></div>';
}
add_shortcode( 'zodiac_slot_machine', 'zodiac_slot_machine_shortcode_handler' );

/**
 * Enqueue scripts and styles for the React application.
 */
function zodiac_slot_machine_enqueue_assets() {
    // Only enqueue assets if the shortcode is present on the page.
    if ( is_singular() && has_shortcode( get_post()->post_content, 'zodiac_slot_machine' ) ) {
        $plugin_version = '1.0.0';

        // Correct paths to the compiled files in the build directory.
        $react_app_js = plugin_dir_url( __FILE__ ) . 'build/main.js';
        $react_app_css = plugin_dir_url( __FILE__ ) . 'build/main.css';

        wp_enqueue_script(
            'zodiac-slot-machine-react-app',
            $react_app_js,
            ['wp-element'], // Dependency for React in WP
            $plugin_version,
            true // Load in footer
        );

        wp_enqueue_style(
            'zodiac-slot-machine-react-app-styles',
            $react_app_css,
            [],
            $plugin_version
        );
    }
}
add_action( 'wp_enqueue_scripts', 'zodiac_slot_machine_enqueue_assets' );
