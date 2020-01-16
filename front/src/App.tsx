import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from 'styled-components';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

import './App.css';
import theme from './theme';
import client from './apollo';
import { Watch, SignUp, SignIn, Reset, OAuth, Home, Movie, Profile, Account, Type, Search } from './pages';
import resources from './translations';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    defaultNS: 'common',                 
    resources,
});

const App: React.FC = function() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route path="/reset" children={<Reset />} />
              <Route path="/signup" children={<SignUp />} />
              <Route path="/signin" children={<SignIn />} />
              <Route path="/oauth" children={<OAuth />} />
              <Route path="/movie/:imdbID" children={<Movie />} />
              <Route path="/stream/:imdbID" children={<Watch />} />
              <Route path="/search" children={<Search />} />
              <Route path="/profile/:username" children={<Profile />} />
              <Route path="/account" children={<Account />} />
              <Route path="/:type/:value" children={<Type />} />
              <Route path="/" children={<Home />} />
            </Switch>
          </Router>
        </ThemeProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
