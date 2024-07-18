document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('/order', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    .then(data => {
        alert('Order placed successfully!');
    }).catch(error => {
        alert('There was an error placing your order.');
        console.error('Error:', error);
    });
});
