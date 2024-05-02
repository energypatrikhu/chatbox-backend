export interface Message {
	senderId: string;
	destinationId: string;
	destinationType: 'group' | 'contact';
	text: string;
}
