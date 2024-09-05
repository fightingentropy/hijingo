/**
 * Token-based Drink Calculator
 *
 * This module exports a function that calculates and displays drink quantities
 * for events based on the number of tokens per person, total covers (attendees),
 * and number of tables. It computes totals and per-table quantities for beer,
 * white wine, red wine, and soft drinks, taking into account different allocation
 * rules for small (<=10 covers) and larger events.
 *
 * The function considers predefined ratios of drinks per token and adjusts
 * quantities based on the event size. It then outputs the results to the console,
 * showing both total quantities and amounts per table.
 */

function tokenDrinksMath(tokensPerPerson, totalCovers, totalTables) {
  // Calculate the total number of drinks for all covers
  const totalDrinks = totalCovers * tokensPerPerson;

  /*
    Our Cost Per Drink 
    beer: 0.9
    white Wine: 5.3
    red Wine: 5.36
    soft Drink: 0.84

    Valid Swaps
    Beer	6	=	Prosecco	1
    Beer	6	=	Wine	1
    Beer	1	=	Soft	1
    Soft	6	=	Wine	1
    Soft	6	=	Prosecco	1
    Prosecco	1	=	Wine	1
  */

  // Define the multiplier for 10 people per token for each drink type
  const _10PaxMultiplierPerToken = {
    beer: 4 * tokensPerPerson,
    whiteWine: 1 * tokensPerPerson,
    redWine: 0.1 * tokensPerPerson,
    softDrink: 2 * tokensPerPerson,
  };

  // Calculate total beers
  const beersTotal = () =>
    totalCovers <= 10
      ? _10PaxMultiplierPerToken.beer
      : (totalCovers / 10) * _10PaxMultiplierPerToken.beer;

  // Modify the red wine calculation
  const redWinesTotal = () => {
    if (tokensPerPerson === 1 || (tokensPerPerson === 2 && totalCovers < 25)) {
      return 0;
    }
    return totalCovers <= 10
      ? _10PaxMultiplierPerToken.redWine
      : (totalCovers / 10) * _10PaxMultiplierPerToken.redWine;
  };

  // Modify the white wine calculation to account for the changes in red wine
  const whiteWinesTotal = () => {
    const baseWhiteWine = totalCovers <= 10
      ? _10PaxMultiplierPerToken.whiteWine
      : (totalCovers / 10) * _10PaxMultiplierPerToken.whiteWine;
    
    // If there's no red wine, all wine is white
    if (redWinesTotal() === 0) {
      return baseWhiteWine;
    }
    
    // Otherwise, subtract red wine from total wine
    return baseWhiteWine - redWinesTotal();
  };

  // Calculate total soft drinks
  const softDrinksTotal = () =>
    totalCovers <= 10
      ? _10PaxMultiplierPerToken.softDrink
      : (totalCovers / 10) * _10PaxMultiplierPerToken.softDrink;

  // Helper function to round wines
  const roundWine = (value) => {
    const rounded = Math.round(value);
    return rounded === 0 && value > 0 ? 1 : rounded; // Ensure at least 1 if not zero
  };

  // Helper function to ceiling soft drinks
  const ceilingSoftDrink = (value) => Math.ceil(value);

  // Calculate totals
  const beerTotal = Math.floor(beersTotal()); // Floor for beers
  const whiteWineTotal = roundWine(whiteWinesTotal());
  const redWineTotal = roundWine(redWinesTotal());
  const softDrinkTotal = ceilingSoftDrink(softDrinksTotal());

  // Calculate per table
  const beerPerTable = beerTotal / totalTables;
  const whiteWinePerTable = whiteWineTotal / totalTables;
  const redWinePerTable = redWineTotal / totalTables;
  const softDrinkPerTable = softDrinkTotal / totalTables;

  // Return the results
  return {
    totalDrinks: totalDrinks,
    totals: {
      beer: beerTotal,
      whiteWine: whiteWineTotal,
      redWine: redWineTotal,
      softDrink: softDrinkTotal,
    },
    perTable: {
      beer: beerPerTable,
      whiteWine: whiteWinePerTable,
      redWine: redWinePerTable,
      softDrink: softDrinkPerTable,
    },
  };
}

// If using ES6 modules
export { tokenDrinksMath };
