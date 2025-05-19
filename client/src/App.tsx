import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Pokedex from "@/pages/pokedex";
import PokemonDetails from "@/pages/pokemon-details";
import Abilities from "@/pages/abilities";
import Moves from "@/pages/moves";
import Items from "@/pages/items";
import TeamBuilder from "@/pages/team-builder";
import Navbar from "@/components/layout/navbar";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/pokedex" component={Pokedex} />
          <Route path="/pokemon/:name" component={PokemonDetails} />
          <Route path="/abilities" component={Abilities} />
          <Route path="/moves" component={Moves} />
          <Route path="/items" component={Items} />
          <Route path="/team-builder" component={TeamBuilder} />
          <Route path="/favorites" component={() => <div>Favorites Page</div>} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
