import { WinGetCategory } from "@/lib/type";
/* EXAMPLE USAGE
winget install --exact --id=WhatsApp.WhatsApp --silent --accept-source-agreements --accept-package-agreements --disable-interactivity --verbose-logs --include-unknown
*/
export const CATEGORIES: WinGetCategory[] = [
	{
		name: 'Browser',
		apps: [
			{
				id: 'Google.Chrome',
				name: 'Google Chrome',
				icon: 'Google.Chrome.svg',
				version: '123',
				publisher: 'Google LLC',
				tags: ['browser', 'google'],
				verifiedSilence: true,
				shortDescription: '',
			},
			{
				id: 'Brave.Brave',
				name: 'Brave',
				icon: 'Brave.Brave.svg',
				version: '110.1.48.171',
				publisher: 'Brave Software Inc',
				tags: ['browser', 'brave'],
				verifiedSilence: true,
				shortDescription: ''
			},
			{
				id: 'Mozilla.Firefox',
				name: 'Mozilla Firefox',
				icon: 'Mozilla.Firefox.svg',
				version: '138.0.4',
				publisher: 'Mozilla',
				tags: ['browser', 'mozilla'],
				verifiedSilence: true,
				shortDescription: '',
			},
			{
				id: 'Microsoft.Edge',
				name: 'Microsoft Edge',
				icon: 'Microsoft.Edge.svg',
				version: '137.0.3296.68',
				publisher: 'Microsoft Corporation',
				tags: ['browser', 'microsoft'],
				verifiedSilence: true,
				shortDescription: '',
			},
			{
				id: 'Opera.Opera',
				name: 'Opera',
				icon: 'Opera.Opera.svg',
				version: '119.0.5497.40',
				publisher: 'Opera Software',
				tags: ['browser', 'opera'],
				verifiedSilence: true,
				shortDescription: ''
			}
		]
	},
	{
		name: 'Messaging',
		apps: [
			{
				id: 'Zoom.Zoom',
				name: 'Zoom',
				icon: 'Zoom.Zoom.svg',
				version: '6.4.64384',
				publisher: 'Zoom Video Communications',
				tags: ['messaging', 'zoom'],
				verifiedSilence: true,
				shortDescription: ''
			},
			{
				id: 'Discord.Discord',
				name: 'Discord',
				icon: 'Discord.Discord.svg',
				version: '1.0.9195',
				publisher: 'Discord Inc.',
				tags: ['messaging', 'discord'],
				verifiedSilence: true,
				shortDescription: ''
			},
			{
				id: 'SlackTechnologies.Slack',
				name: 'Slack',
				icon: 'SlackTechnologies.Slack.svg',
				version: '4.44.65',
				publisher: 'Slack Technologies Inc.',
				tags: ['messaging', 'slack'],
				verifiedSilence: true,
				shortDescription: ''
			},
			{
				id: 'Microsoft.Teams',
				name: 'Microsoft Teams',
				icon: 'Microsoft.Teams.svg',
				version: '25122.1415.3698.6812',
				publisher: 'Microsoft Corporation',
				tags: ['messaging', 'microsoft'],
				verifiedSilence: true,
				shortDescription: ''
			},
			// {
			// 	id: 'Pidgin.Pidgin',
			// 	name: 'Pidgin',
			// 	icon: 'Pidgin.Pidgin.png',
			// 	version: '2.14.14',
			// 	publisher: 'Pidgin IM',
			// 	tags: ['messaging', 'pidgin'],
			// 	verifiedSilence: true,
			// 	shortDescription: '',
			// },
			{
				id: 'Mozilla.Thunderbird',
				name: 'Mozilla Thunderbird',
				icon: 'Mozilla.Thunderbird.svg',
				version: '139.0.2',
				publisher: 'Mozilla',
				tags: ['messaging', 'thunderbird'],
				verifiedSilence: true,
				shortDescription: ''
			},
			// {
			// 	id: 'Trillian.Trillian',
			// 	name: 'Trillian',
			// 	icon: 'Trillian.Trillian.png',
			// 	version: '6.5.0.45',
			// 	publisher: 'Cerulean Studios, LLC',
			// 	tags: ['messaging', 'trillian'],
			// 	verifiedSilence: true,
			// 	shortDescription: ''
			// }
		]
	},
	{
		name: 'Media',
		apps: [
			{
				id: 'Apple.iTunes',
				name: 'Apple iTunes',
				icon: 'Apple.iTunes.svg',
				version: '12.13.7.1',
				publisher: 'Apple Inc.',
				tags: ['media', 'apple'],
				verifiedSilence: true,
				shortDescription: ''
			},
			{
				id: 'VideoLAN.VLC',
				name: 'VLC media player',
				icon: 'VideoLAN.VLC.svg',
				version: '3.0.21',
				publisher: 'VideoLAN',
				tags: ['media', 'vlc'],
				verifiedSilence: true,
				shortDescription: ''
			},
			{
				id: 'AIMP.AIMP',
				name: 'AIMP',
				icon: 'AIMP.AIMP.svg',
				version: '5.10.2418',
				publisher: 'Artem Izmaylov',
				tags: ['media', 'aimp'],
				verifiedSilence: true,
				shortDescription: ''
			},
			// {
			// 	id: 'PeterPawlowski.foobar2000',
			// 	name: 'foobar2000',
			// 	icon: 'PeterPawlowski.foobar2000.svg',
			// 	version: '2.7.1',
			// 	publisher: 'Peter Pawlowski',
			// 	tags: ['media', 'foobar2000'],
			// 	verifiedSilence: true,
			// },
			// {
			// 	id: 'winamp',
			// },
			// {
			// 	id: 'MusicBee'
			// },
			{
				id:'Audacity.Audacity',
				name:'Audacity',
				icon:'Audacity.Audacity.svg',
				version:'2.5.6',
				publisher:'Audacity Team',
				tags:['media','audacity'],
				verifiedSilence:true,
				shortDescription:''
			},
			{
				id: 'CodecGuide.K-LiteCodecPack.Full',
				name:'K-Lite Codec Pack',
				icon:'CodecGuide.K-LiteCodecPack.Full.png',
				version:'19.0.1',
				publisher:'KLCP',
				tags:['media','k-lite'],
				verifiedSilence:true,
				shortDescription:''
			},
			{
				id: 'GOMLab.GOMPlayer',
				name:'GOM Player',
				icon:'GOMLab.GOMPlayer.png',
				version:'2.3.108.5378',
				publisher:'GOMLab',
				tags:['media','gomplayer'],
				verifiedSilence:true,
				shortDescription:''
			},
			{
				id: 'Spotify.Spotify',
				name: 'Spotify',
				icon: 'Spotify.Spotify.svg',
				version: '1.2.66.445.ge795b717',
				publisher: 'Spotify AB',
				tags: ['media', 'spotify', 'music', 'audio', 'streaming'],
				verifiedSilence: true,
				shortDescription: "Spotify is all the music you'll ever need."
			},
			{
				id: 'VentisMedia.MediaMonkey.2024',
				name: 'MediaMonkey',
				icon: 'VentisMedia.MediaMonkey.2024.png',
				version: '2024.1.0.3113',
				publisher: 'Ventis Media Inc.',
				tags: ['media', 'mediamonkey', 'audio', 'video', 'organize'],
				verifiedSilence: true,
				shortDescription: 'MediaMonkey The Media Organizer for Serious Collectors'
			},
			{
				id: 'HandBrake.HandBrake',
				name: 'HandBrake',
				icon: 'HandBrake.HandBrake.svg',
				version: '1.9.2',
				publisher: 'The HandBrake Team',
				tags: ['media', 'handbrake', 'video', 'convert'],
				verifiedSilence: true,
				shortDescription: 'HandBrake is an open-source tool for converting video.'
			},
		]
	},
	{
		name: '.NET',
		apps:[
			// {
			// 	id: ''
			// }
		]
	},
	{
		name: 'Development',
		apps: []
	},
	{
		name: 'Creative',
		apps: []
	},
];