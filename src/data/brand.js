export const brand = {
  name: 'SALTFIRE',
  type: 'Live-fire kitchen & bar',
  city: 'Lahore',
  tagline: 'Cooked over oak. Served without hurry.',
  intro: 'A live-fire kitchen. Oak, charcoal and patience. Forty-six seats, one open hearth.',
  address: '14-C Main Boulevard, Gulberg III, Lahore',
  addressLines: ['14-C Main Boulevard', 'Gulberg III, Lahore'],
  phone: '+92 42 3571 0000',
  phoneHref: 'tel:+924235710000',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Main+Boulevard+Gulberg+III+Lahore',
  ntn: '7654321-8',
  hours: [
    { days: 'Tuesday – Sunday', time: '6:00pm – 12:00am' },
    { days: 'Last orders', time: '11:30pm' },
    { days: 'Monday', time: 'Closed. The fire rests.' },
  ],
  footerLine: ['Fire first.', 'Salt always.'],
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'TikTok', href: 'https://tiktok.com/' },
    { label: 'WhatsApp', href: 'https://wa.me/924235710000' },
  ],
};

// Opening schedule in minutes after midnight, Asia/Karachi. Day 1 = Monday.
export const schedule = {
  timeZone: 'Asia/Karachi',
  open: 18 * 60,
  close: 24 * 60,
  lastOrders: 23 * 60 + 30,
  closedDays: [1],
};

export const navLinks = [
  { id: 'menu', label: 'Menu', to: '/menu', dropdown: 'menu' },
  { id: 'story', label: 'Story', to: '/#fire' },
  { id: 'chef', label: 'Chef’s Table', to: '/#chef' },
  { id: 'private', label: 'Private Dining', to: '/#private', dropdown: 'private' },
  { id: 'visit', label: 'Visit', to: '/#visit' },
];

export const ingredients = [
  'oak smoke',
  'Hunza apricot',
  'black lime',
  'charred leek',
  'desi ghee',
  'smoked labneh',
  'Kashmiri chilli',
  'pomegranate molasses',
  'flaky salt',
  'burnt honey',
  'kalonji',
  'wild sumac',
];

export const fireLines = ['1,200°F at the heart of the coals.', 'No gas. No shortcuts.', 'Everything touches the fire.'];

export const chef = {
  name: 'Chef Daniyal Rehman',
  title: 'CHEF–OWNER · HEAD OF FIRE',
  image: 'images/chef.jpg',
  // Words wrapped in *asterisks* are set in serif italic ember.
  manifesto: [
    'I learned to cook on a *coal* angithi in my grandmother’s courtyard in Sialkot.',
    'Fifteen years in kitchens from Beirut to London taught me *restraint*.',
    'Saltfire is both: the fire I grew up with, and the *patience* to leave it alone.',
  ],
  underline: 'restraint',
};

export const numbers = {
  year: { value: 2019, label: 'First fire lit', sub: 'A borrowed courtyard, one grill, twelve stools.' },
  seats: { value: 46, label: 'seats', sub: 'Eight of them face the fire.' },
  heat: { value: 1200, label: '°F', sub: 'At the heart of the coals, every night.' },
};

export const pickupSlots = ['6:30pm', '7:00pm', '7:30pm', '8:00pm', '8:30pm', '9:00pm', '9:30pm', '10:00pm'];

export const occasions = ['Birthday', 'Anniversary', 'Business', 'Just hungry'];
