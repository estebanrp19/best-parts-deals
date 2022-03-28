const showToast = (type, message) => {
    $.toast({
        heading: type.charAt(0).toUpperCase() + type.slice(1),
        text: message,
        showHideTransition: 'slide',
        icon: type,
        position: 'top-right',
    });
}