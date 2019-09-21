import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import AppliedRoute from './components/AppliedRoute';
import NewNote from './containers/NewNote';
import Notes from './containers/Notes';

const Routes = () => 
    <Switch>
        <AppliedRoute path="/" exact component={Home} />
        { /* Finally, catch all unmatched routes */ }
        <AppliedRoute path="/notes/new" exact component={NewNote} />
        <AppliedRoute path="/notes/:id" exact component={Notes} />
        <Route component={NotFound} />
    </Switch>;

export default Routes;