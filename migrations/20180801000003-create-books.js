
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Books', [
      {
        category_id: 1,
        title: 'Power Plates',
        author: 'Gena Hamshaw',
        year: new Date(2018, 0, 23),
        description: 'Hamshaw is a genius when it comes to plant-based cooking, and this new book boasts “100 nutritionally-balanced, one-dish vegan meals.” What we love about that is two-fold: 1. All of the meals deliver energy-boosting nutrients and fill you up despite the lack of meat. 2. The “one-dish” approach means easy prep and even easier clean-up. These are the kind of meals you need to eat better day after day, not just during the first week of January.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: 1,
        title: 'The Better Brain Solution',
        author: 'Steven Masley, MD',
        year: new Date(2018, 0, 2),
        description: 'A top physician explains how elevated blood sugar is not just damaging to your heart health but also majorly affects your brain. And he offers a prescription for a diet and lifestyle that not only prevents diabetes but also addresses memory loss and cognitive decline. It’s a case for taking care of your brain long before it’s too late.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: 1,
        title: 'Metabolism Revolution',
        author: 'Haylie Pomroy',
        year: new Date(2018, 1, 27),
        description: 'If you’re looking to lose weight, Pomroy’s strategies for kick-starting a stalled metabolism may be what you need. While the focus on losing pounds in just 14 initial days feels way too fast to work, the customized plan—including meal maps, shopping lists, and recipes—offers a long-term solution to keep your metabolism humming along and get to and remain at your ideal weight.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        category_id: 2,
        title: 'On Food and Cooking: The Science and Lore of the Kitchen',
        author: 'Harold McGee',
        year: new Date(2004, 10, 24),
        description: 'Harold McGee\'s On Food and Cooking is a kitchen classic. Hailed by Time magazine as "a minor masterpiece" when it first appeared in 1984, On Food and Cooking is the bible to which food lovers and professional chefs worldwide turn for an understanding of where our foods come from, what exactly they\'re made of, and how cooking transforms them into something new and delicious.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: 2,
        title: 'The Flavor Bible',
        author: 'Karen Page',
        year: new Date(2008, 8, 16),
        description: 'Great cooking goes beyond following a recipe--it\'s knowing how to season ingredients to coax the greatest possible flavor from them. Drawing on dozens of leading chefs\' combined experience in top restaurants across the country, Karen Page and Andrew Dornenburg present the definitive guide to creating "deliciousness" in any dish.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: 2,
        title: 'The Food Lab',
        author: 'J. Kenji Lopez-Alt',
        year: new Date(2015, 8, 21),
        description: 'A New York Times Bestseller. Winner of the James Beard Award for General Cooking and the IACP Cookbook of the Year Award',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        category_id: 3,
        title: 'The Soul of America: The Battle for Our Better Angels',
        author: 'Jon Meacham',
        year: new Date(2018, 4, 8),
        description: '#1 NEW YORK TIMES BESTSELLER. Pulitzer Prize–winning author Jon Meacham helps us understand the present moment in American politics and life by looking back at critical times in our history when hope overcame division and fear.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: 3,
        title: 'The Lost City of the Monkey God',
        author: 'Douglas Preston',
        year: new Date(2017, 0, 1),
        description: 'NAMED A NEW YORK TIMES NOTABLE BOOK OF 2017. #1 New York Times and #1 Wall Street Journal bestseller! A Best Book of 2017 from the Boston Globe. One of the 12 Best Books of the Year from National Geographic',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: 3,
        title: 'The Art Of War',
        author: 'Sun Tzu',
        year: new Date(2017, 3, 7),
        description: 'The Art of War is an ancient Chinese military treatise dating from the 5th century BC. Attributed to the ancient Chinese military strategist Sun Tzu the text is composed of 13 chapters, each of which is devoted to one aspect of the art of war. It is commonly thought of as a definitive work on military strategy and tactics. It was placed at the head of China\'s Seven Military Classics upon the collection\'s creation in 1080 by Emperor Shenzong of Song, and has long been the most influential strategy text in East Asia. It has had an influence on Eastern and Western military thinking, business tactics, legal strategy and beyond.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Books');
  }
};
