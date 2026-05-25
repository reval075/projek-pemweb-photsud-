<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Set up the test environment.
     * Creates a stub Vite manifest so tests don't require running `npm run build`.
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->ensureViteManifest();
    }

    /**
     * Tear down after all tests in a class have run.
     * Cleans up the fake Vite manifest.
     */
    public static function tearDownAfterClass(): void
    {
        static::cleanViteManifest();
        parent::tearDownAfterClass();
    }

    /**
     * Create a minimal fake Vite manifest file for testing purposes.
     * This prevents `Unable to locate file in Vite manifest` exceptions.
     * Only creates the file if it doesn't already exist.
     */
    protected function ensureViteManifest(): void
    {
        $buildDir = public_path('build');
        $manifestPath = $buildDir . '/manifest.json';

        if (!file_exists($manifestPath)) {
            if (!is_dir($buildDir)) {
                mkdir($buildDir, 0755, true);
            }
            $fakeManifest = [
                'resources/css/app.css' => [
                    'file' => 'assets/app-test-fake.css',
                    'src'  => 'resources/css/app.css',
                ],
                'resources/js/app.jsx' => [
                    'file' => 'assets/app-test-fake.js',
                    'src'  => 'resources/js/app.jsx',
                    'isEntry' => true,
                ],
            ];
            file_put_contents($manifestPath, json_encode($fakeManifest, JSON_PRETTY_PRINT));
        }
    }

    /**
     * Remove the fake Vite manifest if it was created by tests.
     */
    protected static function cleanViteManifest(): void
    {
        $manifestPath = public_path('build/manifest.json');

        if (file_exists($manifestPath)) {
            $content = json_decode(file_get_contents($manifestPath), true);
            // Only delete if it's our fake manifest (identified by the fake filename)
            if (isset($content['resources/css/app.css']['file'])
                && $content['resources/css/app.css']['file'] === 'assets/app-test-fake.css') {
                unlink($manifestPath);
            }
        }
    }
}
