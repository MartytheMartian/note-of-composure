import { useContext, useEffect, useRef } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AppShell from './components/layout/appShell';
import ChordDetail from './components/drilldown/chordDetail';
import ScaleDetail from './components/drilldown/scaleDetail';
import ListPage from './components/listPage/listPage';
import AppContext from './state/context';

function RouteTracker() {
  const location = useLocation();
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    dispatch({ type: 'SET_LAST_PATH', path: `${location.pathname}${location.search}` });
  }, [location, dispatch]);

  return null;
}

export default function () {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const hasRestoredInitialPath = useRef(false);

  // Restore the last-viewed route on the initial page load only - once this has run,
  // subsequent visits to "/" (e.g. via the list-mode dropdown) must stay on "/".
  useEffect(() => {
    if (!hasRestoredInitialPath.current) {
      hasRestoredInitialPath.current = true;
      if (location.pathname === '/' && state.lastPath !== '/') {
        navigate(state.lastPath, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppShell>
      <RouteTracker />
      <Routes>
        <Route path="/scale/:scaleId" element={<ScaleDetail />} />
        <Route path="/chord/:chordId" element={<ChordDetail />} />
        <Route path="/" element={<ListPage />} />
        <Route path="*" element={<p>Not found.</p>} />
      </Routes>
    </AppShell>
  );
}
