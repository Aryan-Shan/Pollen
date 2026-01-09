export class IDGenerator {
    constructor() {
        this.adjectives = [
            'gentle', 'silent', 'autumn', 'morning', 'calm', 'misty',
            'wandering', 'ancient', 'green', 'soft', 'whispering', 'wild',
            'sunny', 'cosmic', 'floating', 'drifting', 'breezy', 'cool'
        ];
        this.nouns = [
            'brook', 'river', 'leaf', 'dew', 'breeze', 'cloud',
            'willow', 'moss', 'stone', 'forest', 'meadow', 'rain',
            'sky', 'sun', 'moon', 'star', 'pollen', 'seed'
        ];
    }

    generate() {
        const adj = this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
        const noun = this.nouns[Math.floor(Math.random() * this.nouns.length)];
        const num = Math.floor(Math.random() * 100);
        return `${adj}-${noun}-${num}`;
    }
}
