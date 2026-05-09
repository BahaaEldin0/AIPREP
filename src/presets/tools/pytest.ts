import type { Preset } from '../../core/types.js';

export const pytestPreset: Preset = {
  id: 'pytest',
  name: 'pytest',
  description: 'pytest with fixtures, parametrize, and isolation.',
  type: 'tool',
  rules: [
    {
      content:
        'Test files: `test_*.py` or `*_test.py`. Test functions: `test_*`. Test classes: `Test*` (no `__init__`). pytest auto-discovers — files outside this convention are skipped silently.',
      category: 'conventions',
    },
    {
      content:
        'Fixtures with `@pytest.fixture` decorate factory functions. Inject by parameter name: `def test_user_count(db): assert db.users.count() == 0`. Fixtures > shared `setUp` — opt-in per test, composable, scoped.',
      category: 'patterns',
    },
    {
      content:
        '`conftest.py` shares fixtures across tests in the directory and below. Place at the repo root for project-wide fixtures, at a subdirectory for scoped ones. Cascading scopes mirror the directory tree.',
      category: 'architecture',
    },
    {
      content:
        '`@pytest.fixture(scope=\\\'session\\\' | \\\'module\\\' | \\\'class\\\' | \\\'function\\\')`. Default `\\\'function\\\'` re-creates per test (correct for state-mutating). Database connections / app contexts → `\\\'session\\\'`. Wrong scope = stale or duplicated state.',
      category: 'patterns',
    },
    {
      content:
        '`@pytest.mark.parametrize(\\\'a,b,expected\\\', [(1,2,3), (4,5,9)])` for table-driven tests. Each tuple becomes a separate test ID. Beats hand-rolled loops — per-case names appear in `pytest -v`.',
      category: 'patterns',
    },
    {
      content:
        'Use plain `assert` statements — pytest rewrites them to give detailed failure messages. `self.assertEqual(...)` is unittest legacy and produces worse error output.',
      category: 'conventions',
    },
    {
      content:
        '`tmp_path` fixture for filesystem tests — pytest auto-creates a temp directory and cleans up. Beats hand-rolled `tempfile` + cleanup, and works across the entire test process.',
      category: 'patterns',
    },
    {
      content:
        '`monkeypatch` fixture for environment variables and module attributes: `monkeypatch.setenv(\\\'API_KEY\\\', \\\'test\\\')`, `monkeypatch.setattr(module, \\\'fn\\\', mock_fn)`. Auto-undoes on test exit — cleaner than `unittest.mock.patch` for env vars.',
      category: 'patterns',
    },
    {
      content:
        '`@pytest.mark.skip(reason=\\\'why\\\')` to skip; `@pytest.mark.skipif(cond, reason=\\\'why\\\')` for conditional skip; `@pytest.mark.xfail` for known-failing tests that should NOT block CI but should be tracked. Always include a reason.',
      category: 'patterns',
    },
    {
      content:
        '`capsys` (capture stdout/stderr at Python level), `capfd` (file descriptor level — catches subprocess output too). Use for testing print/logging output. `capsys.readouterr()` returns `(out, err)`.',
      category: 'patterns',
    },
    {
      content:
        '`pytest-xdist` for parallel runs: `pytest -n auto` uses all cores. Tests must be independent (no shared state). DB tests need per-worker DBs or transactional rollback.',
      category: 'performance',
    },
    {
      content:
        'Factory fixtures: a fixture that returns a CALLABLE for parameterized creation: `def make_user(): def _make(**kwargs): return User(**kwargs); return _make`. Inject `make_user` and call inside the test — combines fixtures with arguments.',
      category: 'patterns',
    },
    {
      content:
        'Coverage with `pytest-cov`: `pytest --cov=src --cov-report=term-missing --cov-fail-under=80`. The `--cov-fail-under` makes CI fail on coverage regression. Combine with `coveragerc` for excludes.',
      category: 'testing',
    },
  ],
};
