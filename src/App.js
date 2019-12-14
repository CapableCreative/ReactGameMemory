// PureComponent prevents unecessary rerendering when state is unchanged or equal to initial (as I understand it) - SLF
import React, { PureComponent } from 'react';
// Importing the three components available to this page - SLF
import Header from './components/Header';
import Card from './components/Card';
import GameOver from './components/GameOver';

// I should have made CSS based on component (modular), but I haven't gotten there yet. ** is my note to myself for improvements. - SLF
import './css/index.css';

class App extends PureComponent {
// We set the various states for the card / board. Is it flipped? Does it match the previous selection? First or second click? Any remaing matches, or do we need to shuffle the cards? - SLF
  state = { 
    isFlipped: Array(16).fill(false),
    shuffledCard: App.duplicateCard().sort(() => Math.random() - 0.5),
    clickCount: 1,
    prevSelectedCard: 'Matched',
    prevCardId: 'Matched'
  };

// Static was placed in my reference code. I wasn't sure what it was, so I read this: https://medium.com/front-end-weekly/understanding-static-in-javascript-10782149993 - SLF
  static duplicateCard = () => {
    return [0,1,2,3,4,5,6,7].reduce((preValue, current, index, array) => {
      return preValue.concat([current, current])
    },[]);
  };
// When cards (buttons) are clicked, we prevent default button results and instead flip the card (using the flip card node package)
  handleClick = event => {
    // Prevent default page refresh based on button click
    event.preventDefault();
    // What item is being 'handled'
    const cardId = event.target.id;
    // This card has been flipped
    const newFlipps = this.state.isFlipped.slice();
    this.setState({
        prevSelectedCard: this.state.shuffledCard[cardId],
        prevCardId: cardId
    });
    // Behaviors based on first or second click ...
    if (newFlipps[cardId] === false) {
      newFlipps[cardId] = !newFlipps[cardId];
      this.setState(prevState => ({ 
        isFlipped: newFlipps,
        clickCount: this.state.clickCount + 1
      }));
      if (this.state.clickCount === 2) {
        this.setState({ clickCount: 1 });
        const prevCardId = this.state.prevCardId;
        const newCard = this.state.shuffledCard[cardId];
        const previousCard = this.state.prevSelectedCard;
        // If second card matches first, run isCardMatch function with the previousCard newCard and their id props
        this.isCardMatch(previousCard, newCard, prevCardId, cardId);
      }
    }
  };
  // If the cards match, set id to "Matched" and do not unflip
  isCardMatch = (card1, card2, card1Id, card2Id) => {
    if (card1 === card2) {
      const hideCard = this.state.shuffledCard.slice();
      hideCard[card1Id] = 'Matched';
      hideCard[card2Id] = 'Matched';
      setTimeout(() => {
        this.setState(prevState => ({
          shuffledCard: hideCard
        }))
      }, 1000);
    } else {
      const flipBack = this.state.isFlipped.slice();
      flipBack[card1Id] = false;
      flipBack[card2Id] = false;
      setTimeout(() => {
        this.setState(prevState => ({ isFlipped: flipBack }));
      }, 1000);
    }
  };
  // Once all cards are matched, hide all and prompt to display GameOver.jsx
  restartGame = () => {
    this.setState({
      isFlipped: Array(16).fill(false),
      shuffledCard: App.duplicateCard().sort(() => Math.random() - 0.5),
      clickCount: 1,
      prevSelectedCard: 'Matched!',
      prevCardId: 'Matched'
    });
  };
  // Is every card isFlipped? 
  isGameOver = () => {
    return this.state.isFlipped.every((element, index, array) => element !== false);
  };

  render() {
    return (
     <div>
       <Header restartGame={this.restartGame} />
       { this.isGameOver() ? <GameOver restartGame={this.restartGame} /> :
       <div className="grid-container">
          {
            this.state.shuffledCard.map((cardNumber, index) => 
              <Card
                key={index} 
                id={index} 
                cardNumber={cardNumber} 
                isFlipped={this.state.isFlipped[index]} 
                handleClick={this.handleClick}     
              />
            )
          }
        </div>
       }
     </div>
    );
  }
}

export default App;