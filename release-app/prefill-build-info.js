async function prefill() {
  // Skip if we are not on a TeamCity page
  if (!window.location.href.includes('bender.vaadin.com')) {
    return;
  }

  // Wait for custom run button to appear
  // Use loop of 5 iterations with 1s delay to wait for the button to appear
  for (let i = 0; i < 5; i++) {
    if (document.querySelector('[data-hint-container-id="custom-run"]')) {
      break;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  // Open custom build dialog
  document.querySelector('[data-hint-container-id="custom-run"]').closest('button').click();
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  document.querySelector('#runCustomBuildDiv #customRunPropertiesRequired').closest('li').click();
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  // Get parameters from URL query
  const urlParams = new URLSearchParams(window.location.search);
  const branch = urlParams.get('release_branch');
  const version = urlParams.get('release_version');
  const tag = urlParams.get('release_tag');

  // Prefill checkout branch
  const branchSelect = document.querySelector('#runCustomBuildDiv select[name^="parameter_CheckoutBranch"]');
  if (branchSelect && branch) {
    branchSelect.value = branch;
    branchSelect.closest('tr').classList.add('modifiedParam');
  }
  // Prefill version
  const versionInput = document.querySelector('#runCustomBuildDiv textarea[name^="parameter_version"]');
  if (versionInput && version) {
    versionInput.value = version;
    versionInput.closest('tr').classList.add('modifiedParam');
  }
  // Prefill tag
  const tagInput = document.querySelector('#runCustomBuildDiv textarea[name^="parameter_tag"]');
  if (tagInput && tag) {
    tagInput.value = tag;
    tagInput.closest('tr').classList.add('modifiedParam');
  }
}

prefill();
