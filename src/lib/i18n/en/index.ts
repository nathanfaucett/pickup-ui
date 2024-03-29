import type { BaseTranslation } from '../i18n-types';

const en = {
  errors: {
    unauthorized: 'unauthorized',
    required: '{field:string} is required',
    internalServerError: 'internal server error',
    failedToSignOut: 'failed to sign out.',
    failedToFindLocation: 'failed to find location'
  },
	forms: {
    create: 'create',
    update: 'update',
    success: 'success',
    male: 'Male',
    female: 'Female',
		required: 'This field is required'
	},
	auth: {
		signInUp: 'Sign in/up',
		signOut: 'Sign out',
		emailPlaceholder: 'email',
		username: 'username',
		usernamePlaceholder: 'username',
    sex: 'sex',
    birthdate: 'birthdate',
    birthdatePlaceholder: 'birthdate',
    invalidCredentials: 'Invalid Credentials',
    complete: 'Complete Profile',
		termsOfServiceAcknowledge:
			'By checking this box you accept our <a href="{link:string}">Terms and Conditions</a>.',
	},
  profile: {
    title: 'Profile',
    updated: "Successfully updated"
  },
	home: {
		title: 'Pickup',
    tagline: 'pickup your way.'
	},
	pickup: {
		title: 'Pickup',
    searchPlaceholder: 'Search...',
    create: {
      title: 'Create',
      allGenders: "All"
    },
    type: "type",
    inviteOnly: 'invite only',
    public: 'public',
    minAge: "minimum age",
    maxAge: "maximum age",
    noLimit: "no limit",
    description: "description",
    location: "location",
    streetAddressLine1: "address line 1",
    streetAddressLine2: "address line 2",
    locality: "city",
    region: "state",
    postalCode: "zip code",
    country: "country",
    latitude: 'latitude',
    longitude: 'longitude',
    category: 'category',
    categories: {
      basketball: "Basketball",
      "american-football": "Football",
      "tag-american-football": "Tag Football",
      "flag-american-football": "Flag Football",
      football: "Soccer",
      tennis: "Tennis",
      'doubles-tennis': "Doubles Tennis",
      baseball: "Baseball",
      kickball: "Kickball",
      hockey: "Hockey",
      cricket: "Cricket",
      "table-tennis": "Table Tennis",
      "pickle-ball": "Pickle Ball",
      golf: "Golf",
      rugby: "Rugby",
      squash: "Squash",
      badminton: "Badminton",
      bowling: "Bowling",
      pool: "Pool",
      chess: "Chess",
      darts: "Darts",
      lacrosse: "Lacrosse",
      volleyball: "Volleyball"
    }
	}
} satisfies BaseTranslation;

export default en;
