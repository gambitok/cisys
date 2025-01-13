import React from 'react';
import $ from 'jquery';

export default function SpanCopyKeyboad({ client_id }) {
    const handleClick = (client_id) => {
        // Get the text from the div
        var textToCopy = client_id;
        // Create a temporary textarea element
        var $tempTextArea = $('<textarea>');
        // Set its value to the text content of the div
        $tempTextArea.val(textToCopy);
        // Append the textarea to the body
        $('body').append($tempTextArea);
        // Select the text inside the textarea
        $tempTextArea.select();
        // Copy the selected text to the clipboard
        document.execCommand('copy');
        // Remove the temporary textarea
        $tempTextArea.remove();

        $('body').append('<div id="successAlert" class="alert alert-success" style="display: none;position: fixed;top: 75px;right: 20px">ID has been copied to clipboard!</div>');
        
        $('#successAlert').fadeIn();
        setTimeout(function() {
            $('#successAlert').fadeOut();
        }, 3000);
        setTimeout(function() {
            $('#successAlert').remove();
        }, 4000);

    }

    return (
        <span data-title={ client_id } onClick={() =>handleClick(client_id)} style={{cursor:'pointer'}}>{ client_id.substring(0,8) }...</span>
    );
}
