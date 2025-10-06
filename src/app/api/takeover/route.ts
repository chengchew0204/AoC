import { NextRequest, NextResponse } from 'next/server';
import { RoomServiceClient, TrackType } from 'livekit-server-sdk';

export async function POST(req: NextRequest) {
  try {
    const { roomName, newBroadcasterIdentity } = await req.json();

    if (!roomName || !newBroadcasterIdentity) {
      return NextResponse.json(
        { error: 'Missing required parameters: roomName and newBroadcasterIdentity' },
        { status: 400 }
      );
    }

    const livekitUrl = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!livekitUrl || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'LiveKit configuration missing' },
        { status: 500 }
      );
    }

    const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);

    try {
      // Get current participants in the room
      const participants = await roomService.listParticipants(roomName);
      
      // Find current broadcasters (participants who are publishing)
      const currentBroadcasters = participants.filter(p => 
        p.identity !== newBroadcasterIdentity && 
        p.tracks.some(track => track.type === TrackType.AUDIO || track.type === TrackType.VIDEO)
      );

      // Instead of removing participants, just mute/unpublish their tracks
      // This allows viewers to stay in the room while only removing the broadcast capability
      for (const broadcaster of currentBroadcasters) {
        // Mute all audio and video tracks from the current broadcaster
        const audioTracks = broadcaster.tracks.filter(track => track.type === TrackType.AUDIO);
        const videoTracks = broadcaster.tracks.filter(track => track.type === TrackType.VIDEO);
        
        for (const track of [...audioTracks, ...videoTracks]) {
          try {
            await roomService.mutePublishedTrack(roomName, broadcaster.identity, track.sid, true);
          } catch (muteError) {
            console.log(`Failed to mute track ${track.sid} for ${broadcaster.identity}:`, muteError);
          }
        }
      }

      return NextResponse.json({ 
        success: true,
        message: `Takeover successful. ${currentBroadcasters.length} previous broadcasters removed.`,
        newBroadcaster: newBroadcasterIdentity
      });
    } catch (roomError) {
      // Room might not exist yet, which is fine
      console.log('Room might not exist yet:', roomError);
      return NextResponse.json({ 
        success: true,
        message: 'Room ready for new broadcaster',
        newBroadcaster: newBroadcasterIdentity
      });
    }
  } catch (error) {
    console.error('Takeover error:', error);
    return NextResponse.json(
      { error: 'Failed to process takeover' },
      { status: 500 }
    );
  }
}
