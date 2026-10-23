# Brings the first window of a process whose title contains the given text to the front.
# Usage: powershell -File activate.ps1 <process name> <title text>
# Windows refuses SetForegroundWindow from a background process, so the script presses F24 first, which makes it
# the source of the last input, and attaches to the input thread of the window in front.
param([string]$Process, [string]$Title)
Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class Foreground {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr h);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint p);
  [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();
  [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint a, uint b, bool f);
  [DllImport("user32.dll")] public static extern void keybd_event(byte k, byte s, uint f, UIntPtr e);
  public static void Press(byte key) {
    keybd_event(key, 0, 0, UIntPtr.Zero);
    keybd_event(key, 0, 2, UIntPtr.Zero);
  }
  public static bool Activate(IntPtr h) {
    // F24 has no default action in Windows or the browsers. Alt would move the Chrome focus to its toolbar.
    Press(0x87);
    uint pid;
    uint front = GetWindowThreadProcessId(GetForegroundWindow(), out pid);
    uint me = GetCurrentThreadId();
    AttachThreadInput(me, front, true);
    ShowWindow(h, 9);
    BringWindowToTop(h);
    bool ok = SetForegroundWindow(h);
    AttachThreadInput(me, front, false);
    return ok;
  }
}
'@

# A Start or Search popup that a stray Windows key press left open keeps the focus, so close it.
$frontPid = 0
[void][Foreground]::GetWindowThreadProcessId([Foreground]::GetForegroundWindow(), [ref]$frontPid)
if ((Get-Process -Id $frontPid -ErrorAction SilentlyContinue).ProcessName -match 'StartMenuExperienceHost|SearchHost|SearchApp') {
  [Foreground]::Press(0x1B)
  Start-Sleep -Milliseconds 500
}

$window = Get-Process $Process -ErrorAction SilentlyContinue |
  Where-Object { $_.MainWindowTitle -like "*$Title*" } |
  Select-Object -First 1
if (-not $window) {
  Write-Output 'no window'
  exit 1
}
[Foreground]::Activate($window.MainWindowHandle)
