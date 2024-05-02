export interface Message {
	senderId: number;
	destinationId: number;
	destinationType: 'group' | 'contact';
	text: string;
}
