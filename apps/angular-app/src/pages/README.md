# Component Page Guidelines

To maintain a professional and unified look across the Angular app, all component documentation pages must follow this standard HTML structure.

## Layout Structure

```html
<div class="page-container docs-page">
  <!-- 1. Header Section -->
  <header class="page-header">
    <h1>Component Name</h1>
    <p class="subtitle">
      A concise description of what the component does and when to use it.
    </p>
  </header>

  <!-- 2. Demo Sections -->
  <section class="demo-section">
    <h2>Basic Usage</h2> <!-- Or specific feature like 'Variants', 'States' -->
    <p>Brief explanation of the feature being demonstrated.</p>

    <!-- 3. Variant Cards for Examples -->
    <div class="variant-card">
      <div class="variant-header">
        <h3>Example Title</h3>
      </div>
      
      <!-- 4. Interactive Demo -->
      <div class="demo-container">
        <m3-component-name>Example</m3-component-name>
      </div>

      <!-- 5. Code Sample (Required) -->
      <div class="code-sample">
        <app-code-block language="html" variant="sample" code="<m3-component-name>Example</m3-component-name>"></app-code-block>
      </div>
    </div>
  </section>

  <!-- 6. Accessibility Section (Optional but Recommended) -->
  <section class="demo-section accessibility">
    <h2>♿ Accessibility</h2>
    <ul class="feature-list">
      <li><strong>Keyboard:</strong> How to navigate</li>
      <li><strong>ARIA:</strong> Roles and attributes used</li>
    </ul>
  </section>
</div>
```

## CSS Classes

- `.page-container.docs-page`: Main wrapper for spacing and width constraints.
- `.page-header`: Top level header.
- `.subtitle`: Smaller descriptive text below the `h1`.
- `.demo-section`: Wraps a major feature or logical grouping of examples.
- `.variant-card`: Inner card to house the example components. It provides a visual bounding box.
- `.variant-header`: Houses the `h3` for the title of the variant card.
- `.demo-container` or `.demo-content`: Container for the actual components being showcased.
- `.code-sample`: Houses the code snippet.

By keeping these consistent, we ensure our documentation looks polished and makes it easier to navigate for developers!