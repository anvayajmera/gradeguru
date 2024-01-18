document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faq-search');

  // Function to highlight matching text, used for "intelligent QNA feature"
  function highlightText(element, searchTerm) {
    const innerHTML = element.innerHTML;
    const index = innerHTML.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index !== -1) {
      const highlightedText = innerHTML.substring(0, index) +
        '<span class="highlight">' + innerHTML.substring(index, index + searchTerm.length) + '</span>' +
        innerHTML.substring(index + searchTerm.length);
      element.innerHTML = highlightedText;
    }
  }

  // Function to remove highlighting, for example when a user removes the words from the search bar
  function removeHighlight(element) {
    element.innerHTML = element.textContent;
  }

  // Function to close all items
  function closeAllItems() {
    faqItems.forEach(function(item) {
      item.classList.remove('active');
      const answer = item.querySelector('.faq-answer');
      answer.style.display = 'none';
    });
  }

  // Event listener for search input
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.trim();

    // Remove highlighting when search term is empty
    if (searchTerm === '') {
      closeAllItems();
      faqItems.forEach(function(item) {
        const questionButton = item.querySelector('.faq-question');
        removeHighlight(questionButton);
      });
      return;
    }

    // Loop through each FAQ item
    faqItems.forEach(function(item) {
      const questionButton = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      // Remove previous highlighting
      removeHighlight(questionButton);

      // If the search term is not empty, highlight matching text
      highlightText(questionButton, searchTerm);

      // Show/hide answer based on matching text
      const hasMatch = questionButton.textContent.toLowerCase().includes(searchTerm.toLowerCase());
      item.classList.toggle('active', hasMatch);
      answer.style.display = hasMatch ? 'block' : 'none';
    });
  });

  // Event listener for FAQ item clicks
  faqItems.forEach(function(item) {
    item.addEventListener('click', function() {
      const isActive = this.classList.contains('active');

      // Close all items except the clicked one, to make the FAQ more interactive
      faqItems.forEach(function(otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          otherAnswer.style.display = 'none';
        }
      });

      // Toggle active class to show and hide answers
      this.classList.toggle('active', !isActive);
      const answer = this.querySelector('.faq-answer');
      answer.style.display = !isActive ? 'block' : 'none';
    });
  });
});

