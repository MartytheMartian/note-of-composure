# Note of Composure

Note of Composure is an application that allows the user to navigate a library of all scales and chords, demonstrating the relationship of each scale to each chord and vice-versa. These can be viewed as a general library, or in the context of a specific selected root note.

## Features

- List of relative scales (relative meaning no set root note). For example, "Major" instead of "C Major".
- List of absolute scales (absolute meaning a set root note). For example, "C Major" instead of "Major".
- List of relative scales.
- List of absolute chords.
- Drill down into scales and chords that demonstrate intervals (or specific notes if a root is selected). 
- Navigate seamlessly between any scale and chord to related scales or chords. For example, the list of chords that may be built within a scale should be incuded in the scale drilldown. As another example, the list of scales in which a chord is present should be shown in the chord drilldown.
- Absolute scales and chords should always reference their relative interval. For example, when demonstrating C Major (C, D, E, F, G, A) it should also show the interval with each note (1, 2, 3, 4, 5, 6, 7). don't forget about sharps and flats.

## Design Notes
- Design this like a PWA or desktop application, not a web page.
- Use React.
- Use the 'styles_ref.css' file as a reference. Copy needed styles to a 'styles.css' file. Only copy styles needed.
- See the React application at 'C:\Users\William\Code\tiller\Web' for how I prefer my React code style preferences.
- Build a JSON object that contains all of the music information.
  - Relative scale list. This includes scale name, scale intervals, step pattern (whole steps and half steps).
  - Relative chord list. This includes chord name and intervals.
  - List of notes.
- Use the JSON object to build absolute chords and scales when a specific root is selected.
